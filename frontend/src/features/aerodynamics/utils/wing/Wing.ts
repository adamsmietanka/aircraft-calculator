import { NUMBER_OF_AIRFOIL_SEGMENTS } from "./../../../common/three/config";
import {
  BufferAttribute,
  BufferGeometry,
  Shape,
  ShapeGeometry,
  SphereGeometry,
} from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { Profile } from "./Profile";
import { ProfileFactory } from "./ProfileFactory";

const PANELS = 2 * NUMBER_OF_AIRFOIL_SEGMENTS + 1;

const interpolate = (start: number, end: number, ratio: number) =>
  start + (end - start) * ratio;
const sin = (x: number) => Math.sin((x * Math.PI) / 2);
const asin = (x: number) => (Math.asin(x) / Math.PI) * 2;

export interface WingShape {
  span?: number;
  chord?: number;
  chordTip?: number;
  angle?: number;
  shape?: number;
}

export class Wing {
  public profile: Profile;
  public span: number;
  public chord: number;
  public chordTip: number;
  public angle: number;
  public shape: number;
  public vertices: number[];
  public geometry: BufferGeometry;
  public flap: BufferGeometry;
  public full: boolean;
  public reversed: boolean;

  FLAP_CHORD_START = 0.7;
  FLAP_START = 0.05;
  FLAP_END = 0.9;
  WING_SEGMENTS = 10;

  /**
   * Get leading edge x-position at given y
   * @param y
   * @returns
   */
  public getLE(y: number): number {
    if (this.shape === 0) return 0;
    if (this.shape === 1) return Math.tan((this.angle * Math.PI) / 180) * y;

    const j = Math.abs((2 * y) / this.span);
    return (
      (this.reversed ? 0.7 : 0.3) * this.chord * (1 - Math.sqrt(1 - j * j))
    );
  }

  public getChord(y: number): number {
    if (this.shape === 0) return this.chord;

    const j = Math.abs((2 * y) / this.span);
    if (this.shape === 1) return interpolate(this.chord, this.chordTip, j);
    return this.chord * Math.sqrt(1 - j * j);
  }

  public getAngle(y: number): number {
    return 0;
  }

  public getFlapAxisAngle = () => {
    if (this.shape === 0 || (this.shape === 2 && this.reversed)) return 0;
    if (this.shape === 2) {
      const xStart = 0.4 * this.getChord((this.FLAP_START * this.span) / 2);
      const xEnd = 0.4 * this.getChord((this.FLAP_END * this.span) / 2);
      return -Math.atan2(
        xStart - xEnd,
        (this.span * (this.FLAP_END - this.FLAP_START)) / 2
      );
    }

    const xTip = this.getLE(this.span / 2);
    const x = xTip + (this.chordTip - this.chord) * this.FLAP_CHORD_START;
    return Math.atan2(x, this.span / 2);
  };

  constructor(
    { span = 1, chord = 1, chordTip = 1, angle = 0, shape = 0 }: WingShape,
    profile: string,
    full = true,
    reversed = false
  ) {
    this.profile = ProfileFactory.create(profile);
    this.profile.createPoints();

    this.span = span;
    this.chord = chord;
    this.chordTip = chordTip;
    this.angle = angle;
    this.shape = shape;
    this.vertices = [];
    this.geometry = new SphereGeometry();
    this.flap = new SphereGeometry();
    this.full = full;
    this.reversed = reversed;
  }

  sectionPoints(start: number, end: number) {
    if (this.shape === 2) {
      const range = asin(end) - asin(start);
      const len = Math.ceil(range * this.WING_SEGMENTS);
      const step = range / len;
      return [...Array(len + 1).keys()].map(
        (x) => (sin(asin(start) + x * step) * this.span) / 2
      );
    }
    const range = end - start;
    const len = Math.ceil(range * this.WING_SEGMENTS);
    const step = range / len;
    return [...Array(len + 1).keys()].map(
      (x) => ((start + x * step) * this.span) / 2
    );
  }

  createSection(points: number[][], start: number, end: number) {
    const Y = this.sectionPoints(start, end);

    Y.forEach((y, i) => {
      const rotatedFuse = this.profile.rotate(points, this.getAngle(Y[i - 1]));
      const fuse = this.profile.transform(
        rotatedFuse,
        this.getLE(Y[i - 1]),
        Y[i - 1],
        this.getChord(Y[i - 1])
      );

      const rotatedTip = this.profile.rotate(points, this.getAngle(Y[i]));
      const tip = this.profile.transform(
        rotatedTip,
        this.getLE(y),
        y,
        this.getChord(y)
      );

      const panels = tip.length - 1;

      for (let i = 0; i < panels; i++) {
        this.vertices.push(...fuse[panels - i]);
        this.vertices.push(...fuse[panels - i - 1]);
        this.vertices.push(...tip[panels - i]);
        this.vertices.push(...fuse[panels - i - 1]);
        this.vertices.push(...tip[panels - i - 1]);
        this.vertices.push(...tip[panels - i]);
      }
    });
  }

  public createModel = () => {
    const wingGeometry = new BufferGeometry();
    const tipShape = new Shape();

    this.profile.updateForFlap(this.FLAP_CHORD_START);

    this.createSection(this.profile.points, 0, this.FLAP_START);
    this.createSection(
      this.profile.getOutlineWithoutFlap(this.FLAP_CHORD_START),
      this.FLAP_START,
      this.FLAP_END
    );
    this.createSection(this.profile.points, this.FLAP_END, 1);

    const tip = this.profile.transform(
      this.profile.points,
      this.getLE(this.span / 2),
      this.span / 2,
      this.getChord(this.span / 2)
    );
    tipShape.moveTo(tip[0][0], tip[0][1]);

    for (let i = 1; i < PANELS; i++) {
      tipShape.lineTo(tip[i][0], tip[i][1]);
    }

    const attr = new BufferAttribute(new Float32Array(this.vertices), 3);
    wingGeometry.setAttribute("position", attr);
    wingGeometry.computeVertexNormals();

    const tipGeometry = new ShapeGeometry(tipShape).toNonIndexed();
    tipGeometry.translate(0, 0, this.span / 2);
    tipGeometry.deleteAttribute("uv");

    const flapLowerTip = this.createPanel(
      this.profile.points,
      (this.FLAP_START * this.span) / 2
    );

    let geom = BufferGeometryUtils.mergeGeometries([
      wingGeometry,
      tipGeometry,
      flapLowerTip,
    ]);

    if (this.full) {
      wingGeometry.scale(1, 1, -1);
      wingGeometry.computeVertexNormals();
      tipGeometry.scale(1, 1, -1);
      tipGeometry.computeVertexNormals();

      geom = BufferGeometryUtils.mergeGeometries([
        geom,
        tipGeometry,
        wingGeometry,
      ]);
    }

    this.geometry = geom;

    return geom;
  };

  createPanel(points: number[][], y: number) {
    const shape = new Shape();
    points = this.profile.transform(points, this.getLE(y), y, this.getChord(y));

    shape.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length - 1; i++) {
      shape.lineTo(points[i][0], points[i][1]);
    }
    const geom = new ShapeGeometry(shape).toNonIndexed();
    geom.translate(0, 0, y);
    geom.deleteAttribute("uv");
    return geom;
  }

  createFlap = () => {
    const wingGeometry = new BufferGeometry();
    this.vertices = [];
    const gap = (0.015 * 2) / this.span;

    const points = this.profile.getOutlineFlap(this.FLAP_CHORD_START);
    this.createSection(points, this.FLAP_START + gap, this.FLAP_END - gap);

    const attr = new BufferAttribute(new Float32Array(this.vertices), 3);
    wingGeometry.setAttribute("position", attr);
    wingGeometry.computeVertexNormals();

    const flapTip = this.createPanel(
      points,
      ((this.FLAP_END - gap) * this.span) / 2
    );

    let geom = BufferGeometryUtils.mergeGeometries([wingGeometry, flapTip]);
    this.flap = geom;

    return geom;
  };
}
