import { IPlane } from "../plane/Plane";
import { Wing } from "./Wing";

const defaults = {
  span: 4,
  chord: 1.25,
  chordTip: 0.65,
  angle: 5,
  shape: 1,
};

export class Horizontal extends Wing {
  public position: [x: number, y: number, z: number] = [0, 0, 0];

  constructor(config: IPlane) {
    super({ ...defaults, ...config.horizontal }, "0009");
  }
}
