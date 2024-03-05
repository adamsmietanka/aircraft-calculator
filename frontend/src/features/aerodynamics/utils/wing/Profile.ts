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

export interface ProfileMethods {
  getOutlineWithoutFlap: (X: number) => number[][];
  transform: (
    points: number[][],
    X: number,
    Y: number,
    chord: number
  ) => number[][];
}

export abstract class Profile implements ProfilePoints, ProfileMethods {
  public lower: number[][];
  public upper: number[][];
  public points: number[][];
  public camber: number[][];
  public max: number[][];

  public abstract parseName(name: string): ProfileDetails;
  public abstract createPoints({ M, P, T, F }: ProfileDetails): ProfilePoints;

  public getOutlineWithoutFlap(X = 0.6) {
    return [
      ...this.upper.filter(([x]) => x < X),
      ...this.lower.filter(([x]) => x < X).toReversed(),
    ];
  }

  public transform(
    points: number[][],
    X: number,
    Y: number,
    chord: number
  ) {
    return points.map(([x, y, z]) => [X + chord * x, chord * y, Y]);
  }

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
