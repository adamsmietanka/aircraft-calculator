import { Profile, ProfilePoints } from "./Profile";

const cosineSpacing = (x: number) => (1 - Math.cos(x * Math.PI)) / 2;

const coeffs: Record<number, { r: number; k: number }> = {
  1: { r: 0.058, k: 361.4 },
  2: { r: 0.126, k: 51.64 },
  3: { r: 0.2025, k: 15.957 },
  4: { r: 0.29, k: 6.643 },
  5: { r: 0.391, k: 3.23 },
};

export class Profile5Series extends Profile {
  public r = 0;
  public k = 0;
  public L = 0;
  public S = 0;

  parseName(name: string) {
    const L = parseInt(name[0]);
    const P = parseInt(name[1]);
    const S = parseInt(name[2]);
    const T = parseInt(name.slice(3, 5));
    const F = 0.3;

    this.L = L * 0.15;
    this.P = P * 0.05;
    this.S = S;
    this.T = T * 0.01;
    this.F = F;

    this.r = coeffs[P].r;
    this.k = coeffs[P].k;
  }

  getCamberY(x: number) {
    if (x < this.r) {
      return (
        (this.k / 6) *
        (x * x * x - 3 * this.r * x * x + this.r * this.r * (3 - this.r) * x)
      );
    }
    return ((this.k * this.r * this.r * this.r) / 6) * (1 - x);
  }

  getCamberGradient(x: number) {
    if (x < this.r) {
      return (
        (this.k / 6) *
        (3 * x * x - 6 * this.r * x + this.r * this.r * (3 - this.r))
      );
    }
    return -(this.k * this.r * this.r * this.r) / 6;
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
