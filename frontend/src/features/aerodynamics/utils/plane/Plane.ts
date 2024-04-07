import { BufferGeometry, Mesh, SphereGeometry } from "three";
import { Wing, WingShape } from "../wing/Wing";
import { Fuse, Fuselage } from "./Fuselage";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { Vertical } from "../wing/Vertical";
import fuselages from "../../data/fuselages";
import { Horizontal } from "../wing/Horizontal";

export interface IPlane {
  wing: WingShape;
  vertical: WingShape;
  horizontal: WingShape;
  fuselage: Partial<Fuse>;
}

/**
 * The highest you can put a horizontal stabilizer on a vertical stabilizer
 * @param shape
 * @returns
 */
const getMaxY = (shape: number, span: number) =>
  ((shape === 2 ? 0.8 : 1) * span) / 2;

const interp = (y0: number, y1: number, x: number) => y0 + (y1 - y0) * x;

const clampOverZero = (val: number) => Math.max(0, val);

export class Plane implements IPlane {
  public wing: Wing;
  public vertical: Vertical;
  public horizontal: Horizontal;
  public fuselage: Fuse;
  public geometry: BufferGeometry;
  public config: IPlane;
  public rudder: Mesh;

  constructor(config: IPlane) {
    this.wing = new Wing(config.wing, "2412");
    this.wing.createModel();
    this.wing.createFlap();
    
    this.horizontal = new Horizontal(config);
    this.vertical = new Vertical(config);
    this.fuselage = new Fuselage(config.fuselage);
    this.config = config;

    this.rudder = new Mesh();

    this.geometry = new SphereGeometry();
    this.positionVertical();
    this.positionHorizontal();
    this.position();
  }

  public positionVertical() {
    const { length, wingX } = this.fuselage;
    const x = length - wingX - this.vertical.chord;
    const y = fuselages[this.fuselage.shape].verticalY * length;
    this.vertical.position = [x, y, 0];
    this.vertical.geometry.translate(x, y, 0);
  }

  public positionHorizontal() {
    const { length, shape } = this.fuselage;

    const { horizontalY, verticalY } = fuselages[shape];
    const horizontalGap = (verticalY - horizontalY) * length;
    const relativeY = interp(
      -horizontalGap,
      getMaxY(this.vertical.shape, this.vertical.span),
      0
    );
    const y = verticalY * length + relativeY;
    const x = this.vertical.getLE(clampOverZero(relativeY)) + this.vertical.position[0];
    const chord = this.vertical.getChord(clampOverZero(relativeY));

    this.horizontal.chord = chord;
    this.horizontal.chordTip = 0.6 * chord;

    // setPlane({
    //   horizontalX:
    //     leadTrail[0] -
    //     (isMultifuse(configuration) && shapeH == 1
    //       ? (Math.tan((angleH * Math.PI) / 180) * fuselageDistance) / 2
    //       : 0),
    //   horizontalY: y,
    // });
    // const x = length - wingX - this.vertical.chord;
    // const y = fuselages[this.fuselage.shape].verticalY * length;

    this.horizontal.createModel();
    this.horizontal.createFlap();
    this.horizontal.position = [x, y, 0];
    this.horizontal.geometry.translate(x, y, 0);
  }

  public position() {
    this.fuselage.geometry = this.fuselage.geometry.toNonIndexed();
    this.fuselage.geometry.deleteAttribute("uv");

    this.geometry = BufferGeometryUtils.mergeGeometries([
      this.fuselage.geometry.toNonIndexed(),
      this.wing.geometry,
      this.vertical.geometry,
      this.horizontal.geometry,
    ]);
  }
}
