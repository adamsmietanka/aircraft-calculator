import {
  BufferAttribute,
  BufferGeometry,
  LatheGeometry,
  SphereGeometry,
  Vector2,
} from "three";
import { Wing } from "../wing/Wing";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

export interface Prop {
  blades: number;
  chord: number;
  diameter?: number;
}
const defaults = {
  span: 3,
  chord: 0.3,
  chordTip: 0.2,
  angle: 20,
  shape: 2,
};

export class Propeller extends Wing {
  public blades: number;
  public position: [x: number, y: number, z: number];
  public spinner: BufferGeometry = new SphereGeometry();

  public getAngle(y: number): number {
    return (2 * (-1.5 * y)) / this.span;
  }

  public getThreeFourthsAngle(): number {
    return this.getAngle((0.75 * this.span) / 2);
  }

  merge(geometries: BufferGeometry[]) {
    return BufferGeometryUtils.mergeGeometries(geometries);
  }

  addGeometries(geometries: BufferGeometry[]) {
    this.geometry = this.merge([this.geometry, ...geometries]);
  }

  public createBlade() {
    const blade = new BufferGeometry();
    this.createSection(this.profile.points, 0, 1);

    const attr = new BufferAttribute(new Float32Array(this.vertices), 3);
    blade.setAttribute("position", attr);
    blade.computeVertexNormals();

    return blade;
  }

  public createSpinner() {
    const points = [];
    for (let i = 0; i < 10; i++) {
      points.push(new Vector2(Math.sin(i * 0.16) * 0.25, i * 0.05));
    }
    const geometry = new LatheGeometry(points)
      .rotateZ(-Math.PI / 2)
      .toNonIndexed();
    this.spinner = geometry;
    this.spinner.deleteAttribute("uv");

    return geometry;
  }

  constructor({ blades = 3, diameter = 2.5, chord = 0.2 }: Prop) {
    super({ ...defaults, span: diameter, chord }, "6612", false, true);
    this.blades = blades;
    this.position = [0, 0, 0];

    const geom = this.createBlade();
    geom.translate(-this.chord / 2, 0, 0);
    geom.rotateZ(-Math.PI * 0.5);

    this.geometry = geom;
    this.createSpinner();
  }
}
