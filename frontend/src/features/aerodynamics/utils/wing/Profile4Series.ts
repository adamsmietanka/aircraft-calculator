import { Profile, ProfilePoints } from "./Profile";

const cosineSpacing = (x: number) => (1 - Math.cos(x * Math.PI)) / 2;

export class Profile4Series extends Profile {
  parseName(name: string) {
    return {
      M: parseInt(name[0]) / 100,
      P: parseInt(name[1]) / 10,
      T: parseInt(name.slice(2, 4)) / 100,
      F: 0.3,
    };
  }

  getCamberY(x: number) {
    if (x < this.P) {
      return (this.M / Math.pow(this.P, 2)) * (2 * this.P * x - x * x);
    }
    return (
      (this.M / Math.pow(1 - this.P, 2)) *
      (1 - 2 * this.P + 2 * this.P * x - x * x)
    );
  }

  getCamberGradient(x: number) {
    if (x < this.P) {
      return ((2 * this.M) / Math.pow(this.P, 2)) * (this.P - x);
    }
    return ((2 * this.M) / Math.pow(1 - this.P, 2)) * (this.P - x);
  }

  getThickness(x: number) {
    return (
      5 *
      this.T *
      (0.2969 * Math.pow(x, 0.5) -
        0.126 * x -
        0.3516 * Math.pow(x, 2) +
        0.2843 * Math.pow(x, 3) -
        0.1036 * Math.pow(x, 4))
    );
  }

  getLowerUpper(x: number) {
    const theta = Math.atan(this.getCamberGradient(x));
    const halfThickness = this.getThickness(x);
    const y = this.getCamberY(x);
    return [
      [
        x + halfThickness * Math.sin(theta),
        y - halfThickness * Math.cos(theta),
        0,
      ],
      [
        x - halfThickness * Math.sin(theta),
        y + halfThickness * Math.cos(theta),
        0,
      ],
    ];
  }

  createPoints() {
    let upper = [];
    let lower = [];
    let camber = [];

    for (let i = 0; i < Profile.SEGMENTS; i++) {
      const x = cosineSpacing(i / Profile.SEGMENTS);
      const y = this.getCamberY(x);
      const points = this.getLowerUpper(x);

      lower.push(points[0]);
      upper.push(points[1]);
      camber.push([x, y, 0]);
    }
    lower.push([1, 0, 0]);
    upper.push([1, 0, 0]);
    camber.push([1, 0, 0]);

    const max = this.getLowerUpper(this.F);

    this.upper = upper;
    this.lower = lower;
    this.camber = camber;
    this.max = max;
    this.points = [...upper, ...lower.toReversed().slice(1)];
  }
}
