import { CubicBezierCurve3, CurvePath, Vector3 } from "three";

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
  getOutlineFlap: (X: number) => number[][];
  getFlapLE: (X: number) => number[][];
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

  public static FLAP_LE_SEGMENTS = 8;

  public abstract parseName(name: string): ProfileDetails;
  public abstract createPoints({ M, P, T, F }: ProfileDetails): ProfilePoints;

  public getOutlineWithoutFlap(X = 0.6) {
    return [
      ...this.upper.filter(([x]) => x <= X),
      ...this.lower.filter(([x]) => x <= X).toReversed(),
    ];
  }

  public getFlapLE(X: number) {
    const firstL = this.lower.filter(([x]) => x >= X)[0];
    const firstU = this.upper.filter(([x]) => x >= X)[0];
    const center = [
      (firstU[0] + firstL[0]) / 2,
      (firstU[1] + firstL[1]) / 2,
      firstU[2] - firstL[2],
    ];
    const radius = (firstU[1] - firstL[1]) / 2;
    console.log(center);
    return [...Array(Profile.FLAP_LE_SEGMENTS - 1).keys()].map((i) => [
      center[0] -
        radius * Math.sin(((i + 1) / Profile.FLAP_LE_SEGMENTS) * Math.PI),
      center[1] -
        radius * Math.cos(((i + 1) / Profile.FLAP_LE_SEGMENTS) * Math.PI),
      center[2],
    ]);
  }

  public getOutlineFlap(X = 0.6) {
    return [
      ...this.lower.filter(([x]) => x >= X).toReversed(),
      ...this.getFlapLE(X),
      ...this.upper.filter(([x]) => x >= X),
    ];
  }

  public transform(points: number[][], X: number, Y: number, chord: number) {
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
