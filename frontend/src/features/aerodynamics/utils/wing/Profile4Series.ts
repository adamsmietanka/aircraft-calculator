import { Profile } from "./Profile";

export class Profile4Series extends Profile {
  parseName(name: string) {
    this.M = parseInt(name[0]) / 100;
    this.P = parseInt(name[1]) / 10;
    this.T = parseInt(name.slice(2, 4)) / 100;
    this.F = 0.3;
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

}
