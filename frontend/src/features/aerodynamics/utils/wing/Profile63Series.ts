import { Profile6Series } from "./Profile6Series";

export class Profile63Series extends Profile6Series {

  getThickness(x: number) {
    return (
      (this.T / 0.12) *
      (0.1284547 * Math.pow(x, 0.5) +
        0.0112057 * x -
        0.10456028 * Math.pow(x, 2) -
        0.24102699 * Math.pow(x, 3) +
        0.20586258 * Math.pow(x, 4))
    );
  }

  constructor(name: string) {
    super(name);
    this.parseName(name);
    this.F = 0.34;
  }
}
