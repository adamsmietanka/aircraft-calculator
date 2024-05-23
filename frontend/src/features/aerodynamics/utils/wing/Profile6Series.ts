import { Profile } from "./Profile";

export abstract class Profile6Series extends Profile {
  public Cl = 0;
  public Px = 0;

  parseName(name: string) {
    this.Px = parseInt(name[1]);
    const T = parseInt(name.slice(4, 6));

    this.Cl = parseInt(name[3]) / 10;

    this.T = T * 0.01;
  }

  getCamberY(x: number) {
    if (x === 0 || x === 1) return 0;
    return (
      (-this.Cl / (4 * Math.PI)) * ((1 - x) * Math.log(1 - x) + x * Math.log(x))
    );
  }

  getCamberGradient(x: number) {
    if (x === 0 || x === 1) return 0;
    return (-this.Cl / (4 * Math.PI)) * (Math.log(1 - x) - Math.log(x));
  }

}
