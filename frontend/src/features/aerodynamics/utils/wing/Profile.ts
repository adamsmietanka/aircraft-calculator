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
  max: { x: number; y: number; z: number }[];
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


const cosineSpacing = (x: number) => (1 - Math.cos(x * Math.PI)) / 2;

/**
 * The class encompasses all the logic of creating the profile and flap outlines
 * @param SEGMENTS number of the profile segments, per side. So all profiles have 2x
 */
export abstract class Profile
  implements ProfilePoints, ProfileMethods, ProfileDetails
{
  public name: string;
  public M: number = 0;
  public P: number = 0;
  public T: number = 0;
  public F: number = 0.3;

  // 5 series
  public L: number = 0;
  public S: boolean = false;

  public lower: number[][] = [];
  public upper: number[][] = [];
  public points: number[][] = [];
  public camber: number[][] = [];
  public max: { x: number; y: number; z: number }[] = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ];
  public lowerFlat: number[][] = [];
  public upperFlat: number[][] = [];

  public static SEGMENTS = NUMBER_OF_AIRFOIL_SEGMENTS;
  public static FLAP_LE_SEGMENTS = 8;
  public FLAP_GAP = 0.01;

  public abstract parseName(name: string): void;
  public abstract getCamberY(x: number): number;
  public abstract getCamberGradient(x: number): number;
  public abstract getThickness(x: number): number;

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

    this.M = this.getCamberY(this.P);

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
    this.name = name;
    this.parseName(name);
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
  public rotate(points: number[][], angle: number) {
    const temp = points.map(([x, y, z]) => [x - 0.25, y, z]);
    return temp.map(([x, y, z]) => [
      x * Math.cos(angle) + y * Math.sin(angle) + 0.25,
      y * Math.cos(angle) - x * Math.sin(angle),
      z,
    ]);
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
    const Xgap = X - 2 * this.FLAP_GAP;
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
  public flatten() {
    let sum = 0;
    this.upperFlat = this.upper.map((p, index, arr) => {
      if (index > 0) {
        const dist = Math.hypot(
          p[0] - arr[index - 1][0],
          p[1] - arr[index - 1][1]
        );
        sum += dist;
      }
      return [sum, 0.01, 0];
    });

    sum = 0;
    this.lowerFlat = this.lower.map((p, index, arr) => {
      if (index > 0) {
        const dist = Math.hypot(
          p[0] - arr[index - 1][0],
          p[1] - arr[index - 1][1]
        );
        sum += dist;
      }
      return [sum, -0.01, 0];
    });
  }
}
