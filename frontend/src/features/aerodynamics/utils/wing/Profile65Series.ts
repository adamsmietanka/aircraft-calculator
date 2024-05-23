import { Profile6Series } from "./Profile6Series";

export class Profile65Series extends Profile6Series {

  getThickness(x: number) {
    return (
      (this.T / 0.12) *
      (0.12524926 * Math.pow(x, 0.5) -
        0.05260881 * x +
        0.21507571 * Math.pow(x, 2) -
        0.65642283 * Math.pow(x, 3) +
        0.3685111 * Math.pow(x, 4))
    );
  }

  constructor(name: string) {
    super(name);
    this.parseName(name);
    this.F = 0.4;
  }
}
