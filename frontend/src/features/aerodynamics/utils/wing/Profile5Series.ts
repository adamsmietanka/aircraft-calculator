import { Profile } from "./Profile";

const cosineSpacing = (x: number) => (1 - Math.cos(x * Math.PI)) / 2;

const coeffs: Record<number, { r: number; k: number }> = {
  1: { r: 0.058, k: 361.4 },
  2: { r: 0.126, k: 51.64 },
  3: { r: 0.2025, k: 15.957 },
  4: { r: 0.29, k: 6.643 },
  5: { r: 0.391, k: 3.23 },
};
const coeffsReflex: Record<number, { r: number; k1: number; k2: number }> = {
  2: { r: 0.13, k1: 51.99, k2: 7.64e-4 },
  3: { r: 0.217, k1: 15.793, k2: 6.77e-3 },
  4: { r: 0.318, k1: 6.52, k2: 3.03e-2 },
  5: { r: 0.441, k1: 3.191, k2: 0.1355 },
};

export class Profile5Series extends Profile {
  public r = 0;
  public k1 = 0;
  public k2 = 0;

  parseName(name: string) {
    const L = parseInt(name[0]);
    const P = parseInt(name[1]);
    const S = parseInt(name[2]);
    const T = parseInt(name.slice(3, 5));
    const F = 0.3;

    this.L = parseFloat((L * 0.15).toFixed(2));
    this.P = parseFloat((P * 0.05).toFixed(2));
    this.S = !!S;
    this.T = T * 0.01;
    this.F = F;

    this.r = this.S ? coeffsReflex[P].r : coeffs[P].r;
    this.k1 = this.S ? coeffsReflex[P].k1 : coeffs[P].k;
    this.k2 = coeffsReflex[P].k2;
  }

  getCamberY(x: number) {
    if (x < this.r) {
      if (this.S)
        return (
          (this.k1 / 6) *
          (Math.pow(x - this.r, 3) -
            this.k2 * Math.pow(1 - this.r, 3) * x -
            Math.pow(this.r, 3) * x +
            Math.pow(this.r, 3))
        );
      return (
        (this.k1 / 6) *
        (x * x * x - 3 * this.r * x * x + this.r * this.r * (3 - this.r) * x)
      );
    }

    if (this.S)
      return (
        (this.k1 / 6) *
        (this.k2 * Math.pow(x - this.r, 3) -
          this.k2 * Math.pow(1 - this.r, 3) * x -
          Math.pow(this.r, 3) * x +
          Math.pow(this.r, 3))
      );
    return ((this.k1 * this.r * this.r * this.r) / 6) * (1 - x);
  }

  getCamberGradient(x: number) {
    if (x < this.r) {
      return (
        (this.k1 / 6) *
        (3 * x * x - 6 * this.r * x + this.r * this.r * (3 - this.r))
      );
    }
    return -(this.k1 * this.r * this.r * this.r) / 6;
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

    this.M = this.getCamberY(this.P);

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
    this.max = max.map(([x, y, z]) => ({
      x,
      y,
      z,
    }));
    this.points = [...upper, ...lower.toReversed().slice(1)];
  }

  constructor(name: string) {
    super(name);
    this.parseName(name);
  }
}
