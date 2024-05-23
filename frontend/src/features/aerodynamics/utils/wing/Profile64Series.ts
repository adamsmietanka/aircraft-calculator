import { Profile6Series } from "./Profile6Series";

export class Profile64Series extends Profile6Series {

  getThickness(x: number) {
    return (
      (this.T / 0.12) *
      (0.1367233 * Math.pow(x, 0.5) -
        0.04991688 * x +
        0.10498626 * Math.pow(x, 2) -
        0.4979228 * Math.pow(x, 3) +
        0.30619848 * Math.pow(x, 4))
    );
  }

  constructor(name: string) {
    super(name);
    this.parseName(name);
    this.F = 0.37;
  }
}
