import { NUMBER_OF_AIRFOIL_SEGMENTS } from "./../../../common/three/config";
import { BufferAttribute, BufferGeometry, Shape, ShapeGeometry } from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { Profile, ProfilePoints } from "./Profile";
import { ProfileFactory } from "./ProfileFactory";

const PANELS = 2 * NUMBER_OF_AIRFOIL_SEGMENTS + 1;

export interface WingShape {
  span: number;
  chord: number;
  chordTip: number;
  angle: number;
  shape: number;
}

export class Wing {
  public profile: Profile;
  public span: number;
  public chord: number;
  public chordTip: number;
  public angle: number;
  public shape: number;
  public vertices: number[];

  FLAP_START = 0.1;
  FLAP_END = 0.95;
  WING_SEGMENTS = 10;

  /**
   * Get leading edge x-position at given y
   * @param y
   * @returns
   */
  public getLE(y: number): number {
    return 0;
  }

  public getChord(y: number): number {
    return this.chord;
  }

  constructor(
    { span, chord, chordTip, angle, shape }: WingShape,
    profile: string
  ) {
    this.profile = ProfileFactory.create(profile);
    this.span = span;
    this.chord = chord;
    this.chordTip = chordTip;
    this.angle = angle;
    this.shape = shape;
    this.vertices = [];
  }

  sectionPoints(start: number, end: number) {
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
      const fuse = this.profile.transform(
        points,
        this.getLE(Y[i - 1]),
        Y[i - 1],
        this.getChord(Y[i - 1])
      );

      const tip = this.profile.transform(
        points,
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
  createWingModel = () => {
    const wingGeometry = new BufferGeometry();
    const tipShape = new Shape();

    this.createSection(this.profile.points, 0, this.FLAP_START);
    this.createSection(
      this.profile.getOutlineWithoutFlap(),
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

    let geom = BufferGeometryUtils.mergeGeometries([wingGeometry, tipGeometry]);

    return geom;
  };
}
