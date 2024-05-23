import { Profile } from "./Profile";

export class ProfileFlat extends Profile {
  public static SEGMENTS_V = 2; // amount of segments on the shorter sides of the plate

  parseName(name: string) {
    this.M = 0;
    this.P = 0;
    this.T = parseInt(name) / 100;
    this.F = 0.3;
  }

  getLowerUpper(x: number) {
    return [
      [x, -this.T / 2, 0],
      [x, this.T / 2, 0],
    ];
  }

  getCamberY(x: number): number {
      return 0
  }

  getCamberGradient(x: number): number {
      return 0
  }

  getThickness(x: number): number {
      return this.T
  }

  createPoints() {
    let upper = [];
    let lower = [];
    let camber = [];

    for (let i = 0; i <= Profile.SEGMENTS; i++) {
      let x, y;
      if (i < ProfileFlat.SEGMENTS_V) {
        x = 0;
        y = ((i / ProfileFlat.SEGMENTS_V) * this.T) / 2;
      } else if (i <= Profile.SEGMENTS - ProfileFlat.SEGMENTS_V) {
        x =
          (i - ProfileFlat.SEGMENTS_V) /
          (Profile.SEGMENTS - 2 * ProfileFlat.SEGMENTS_V);
        y = this.T / 2;
      } else {
        x = 1;
        y = (((Profile.SEGMENTS - i) / ProfileFlat.SEGMENTS_V) * this.T) / 2;
      }

      lower.push([x, -y, 0]);
      upper.push([x, y, 0]);
      camber.push([x, 0, 0]);
    }
    const max = [
      [1, -this.T / 2, 0],
      [1, this.T / 2, 0],
    ];

    this.upper = upper;
    this.lower = lower;
    this.camber = camber;
    this.max = max.map(([x, y, z]) => ({
      x,
      y,
      z,
    }));
    this.points = [...upper, ...lower.toReversed().slice(1)];
  }
}
