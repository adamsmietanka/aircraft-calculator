import { IPlane } from "../plane/Plane";
import { Wing } from "./Wing";

const defaults = {
  span: 3,
  chord: 1.5,
  chordTip: 0.9,
  angle: 20,
  shape: 1,
};

export class Vertical extends Wing {
  public position: [x: number, y: number, z: number];

  constructor(config: IPlane) {
    super({ ...defaults, ...config.vertical }, "0009", false, true);
    this.createModel();
    this.createFlap();
    this.geometry.rotateX(-Math.PI / 2);
    this.position = [0, 0, 0];
  }
}
