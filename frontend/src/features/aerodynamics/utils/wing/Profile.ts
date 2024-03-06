import { NUMBER_OF_AIRFOIL_SEGMENTS } from "../../../common/three/config";

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
  transform: (
    points: number[][],
    X: number,
    Y: number,
    chord: number
  ) => number[][];
  getOutlineWithoutFlap: (X: number) => number[][];
  getOutlineFlap: (X: number) => number[][];
  getFlapLE: (X: number) => number[][];
  updateForFlap: (X: number) => void;
}

/**
 * The class encompasses all the logic of creating the profile and flap outlines
 * @param SEGMENTS number of the profile segments, per side. So all profiles have 2x
 */
export abstract class Profile
  implements ProfilePoints, ProfileMethods, ProfileDetails
{
  public M: number;
  public P: number;
  public T: number;
  public F: number;

  public lower: number[][];
  public upper: number[][];
  public points: number[][];
  public camber: number[][];
  public max: number[][];

  public static SEGMENTS = NUMBER_OF_AIRFOIL_SEGMENTS;
  public static FLAP_LE_SEGMENTS = 8;
  public static FLAP_GAP = 0.01;

  public abstract parseName(name: string): ProfileDetails;
  public abstract createPoints(): ProfilePoints;
  public abstract getLowerUpper(x: number): number[][];

  constructor(name: string) {
    const { M, P, T, F } = this.parseName(name);

    this.M = M;
    this.P = P;
    this.T = T;
    this.F = F;

    const { upper, lower, camber, max, points } = this.createPoints();

    this.upper = upper;
    this.lower = lower;
    this.camber = camber;
    this.max = max;
    this.points = points;
  }

  /**
   * Transform points to align with a provided wing slice
   * @param points the array of points to transform
   * @param X the x coordinate of the Leading Edge
   * @param Y the y coordinate of the LE
   * @param chord the length of the chord at the slice
   * @returns transformed points
   */
  public transform(points: number[][], X: number, Y: number, chord: number) {
    return points.map(([x, y, z]) => [X + chord * x, chord * y, Y]);
  }

  /**
   * Get the outline of the wing excluding the flap
   * @param X position of the flap along the chord
   * @returns
   */
  public getOutlineWithoutFlap(X = 0.6) {
    return [
      ...this.upper.filter(([x]) => x < X),
      ...this.lower.filter(([x]) => x < X).toReversed(),
    ];
  }

  /**
   * Get the leading edge points of the flap excluding the existing points
   * where the profile is cut
   * @param X position of the flap along the chord
   * @returns
   */
  public getFlapLE(X: number) {
    const firstL = this.lower.filter(([x]) => x >= X)[0];
    const firstU = this.upper.filter(([x]) => x >= X)[0];
    const center = [
      (firstU[0] + firstL[0]) / 2,
      (firstU[1] + firstL[1]) / 2,
      0,
    ];
    const radius = (firstU[1] - firstL[1]) / 2;

    return [...Array(Profile.FLAP_LE_SEGMENTS - 1).keys()].map((i) => [
      center[0] -
        radius * Math.sin(((i + 1) / Profile.FLAP_LE_SEGMENTS) * Math.PI),
      center[1] -
        radius * Math.cos(((i + 1) / Profile.FLAP_LE_SEGMENTS) * Math.PI),
      0,
    ]);
  }

  /**
   * Get the outline of the flap including a rounded leading edge
   * @param X position of the flap along the chord
   * @returns
   */
  public getOutlineFlap(X = 0.6) {
    return [
      ...this.lower.filter(([x]) => x >= X).toReversed(),
      ...this.getFlapLE(X),
      ...this.upper.filter(([x]) => x >= X),
    ];
  }

  public getLastWingIndex(X = 0.6) {
    const points = this.upper.filter(([x]) => x < X);
    return points.length - 1;
  }

  public updateForFlap(X = 0.6) {
    const Xgap = X - 2 * Profile.FLAP_GAP;
    const yFlap = this.getLowerUpper(X).map(([x, y, z]) => y);
    const yGap = this.getLowerUpper(Xgap).map(([x, y, z]) => y);

    const index = this.getLastWingIndex(X);

    this.upper = [
      ...this.upper.slice(0, index),
      [Xgap, yGap[1], 0],
      [X, yFlap[1], 0],
      ...this.upper.slice(index + 2),
    ];

    this.lower = [
      ...this.lower.slice(0, index),
      [Xgap, yGap[0], 0],
      [X, yFlap[0], 0],
      ...this.lower.slice(index + 2),
    ];
  }
}