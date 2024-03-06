import { NUMBER_OF_AIRFOIL_SEGMENTS } from "../../../common/three/config";
import { Profile, ProfileDetails, ProfilePoints } from "./Profile";

export class ProfileFlat extends Profile {
  public static SEGMENTS = NUMBER_OF_AIRFOIL_SEGMENTS;
  public static SEGMENTS_V = 2; // amount of segments on the shorter sides of the plate

  parseName(name: string) {
    return {
      M: 0,
      P: 0,
      T: parseInt(name) / 100,
      F: 0.3,
    };
  }

  getLowerUpper(x: number) {
    return [
      [x, -this.T / 2, 0],
      [x, this.T / 2, 0],
    ];
  }

  createPoints(): ProfilePoints {
    let upper = [];
    let lower = [];
    let camber = [];

    for (let i = 0; i <= ProfileFlat.SEGMENTS; i++) {
      let x, y;
      if (i < ProfileFlat.SEGMENTS_V) {
        x = 0;
        y = ((i / ProfileFlat.SEGMENTS_V) * this.T) / 2;
      } else if (i <= ProfileFlat.SEGMENTS - ProfileFlat.SEGMENTS_V) {
        x =
          (i - ProfileFlat.SEGMENTS_V) /
          (ProfileFlat.SEGMENTS - 2 * ProfileFlat.SEGMENTS_V);
        y = this.T / 2;
      } else {
        x = 1;
        y =
          (((ProfileFlat.SEGMENTS - i) / ProfileFlat.SEGMENTS_V) * this.T) / 2;
      }

      lower.push([x, -y, 0]);
      upper.push([x, y, 0]);
      camber.push([x, 0, 0]);
    }
    const max = [
      [1, -this.T / 2, 0],
      [1, this.T / 2, 0],
    ];

    return {
      points: [...upper, ...lower.toReversed()],
      upper,
      lower,
      camber,
      max,
    };
  }
}
