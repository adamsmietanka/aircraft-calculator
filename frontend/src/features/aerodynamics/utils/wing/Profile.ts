export interface ProfileDetails {
  M: number;
  P: number;
  T: number;
  F: number;
}

export interface ProfilePoints {
  camber: number[][];
  lower: number[][];
  upper: number[][];
  points: number[][];
  max: number[][];
}

export abstract class Profile implements ProfilePoints {
  public lower: number[][];
  public upper: number[][];
  public points: number[][];
  public camber: number[][];
  public max: number[][];

  public abstract parseName(name: string): ProfileDetails;
  public abstract createPoints({ M, P, T, F }: ProfileDetails): ProfilePoints;

  constructor(name: string) {
    const details = this.parseName(name);
    const { upper, lower, camber, max, points } = this.createPoints(details);
    this.upper = upper;
    this.lower = lower;
    this.camber = camber;
    this.max = max;
    this.points = points;
  }
}
