import {
  findUpperBound,
  linearInterpolation,
} from "../../../utils/interpolation/binarySearch";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import linearRegression from "../../../utils/interpolation/linearRegression";
import round from "../../../utils/interpolation/round";
import profiles from "../data/profiles";
import { default as profilesInterpolated } from "../data/profiles_interpolated";

// 0 - this is the alpha/Cz or the x in the exported arrays
// 1 - is the trace for the lowest Re ~ 3 * 10^6
const INDEX_OF_COEFFICIENT = 2;
const NUMBER_OF_POINTS = 100;

const generatePoints = (
  start: number,
  end: number,
  XY: number[][],
  extrapolate = true
) => {
  let X = XY.map(([x, y]) => x);
  let Y = XY.map(([x, y]) => y);
  let result = [];

  for (let i = 0; i <= NUMBER_OF_POINTS; i++) {
    let x = start + (i * (end - start)) / NUMBER_OF_POINTS;
    // fix floating point precision
    if (i === NUMBER_OF_POINTS) {
      x = end;
    }

    const index = findUpperBound(X, x, extrapolate);
    const y = linearInterpolation(
      X[index - 1],
      Y[index - 1],
      X[index],
      Y[index],
      x
    );
    result.push([x, y]);
  }
  return result;
};

const getCoefficients = (profile: string) => {
  let result: Record<string, number[][][]> = { cz: [], cd: [] };
  for (let i = 1; i <= 3; i++) {
    const oldCz = profiles[profile].cz
      .map((array) => [array[0], array[i]])
      .filter(
        ([x, y]) => y !== 0 && y !== null && x !== null && -20 <= x && x <= 20
      ) as number[][];

    const startX = oldCz[0][0];
    const endX = oldCz[oldCz.length - 1][0];

    let cz = generatePoints(startX, endX, oldCz);

    // get lowest and highest Coefficient of Lift from the generated points
    const highestCz = cz.reduce((previous, current) =>
      current[1] > previous[1] ? current : previous
    )[1];

    const lowestCz = cz.reduce((previous, current) =>
      current[1] < previous[1] ? current : previous
    )[1];

    let oldCd = profiles[profile].cd
      .map((array) => [array[0], array[i]])
      .filter(([x, y]) => y !== 0 && y !== null) as number[][];

    let cd = generatePoints(lowestCz, highestCz, oldCd, true);
    result.cz.push(cz);
    result.cd.push(cd);
  }

  return result;
};

const isWithin = (x: number, delta: number, target: number) => {
  return target - delta < x && x < target + delta;
};

export const getBetterCoefficients = (profile: string) => {
  let result: Record<string, number[][][]> = { cz: [], cd: [] };
  for (let i = 1; i <= 3; i++) {
    const cl = profiles[profile].cz
      .map((array) => [array[0], array[i]])
      .filter(
        ([x, y]) => y !== 0 && y !== null && x !== null && -20 <= x && x <= 20
      ) as number[][];

    const startX = cl[0][0];
    const endX = cl[cl.length - 1][0];

    let newCl = generatePoints(startX, endX, cl);

    // get lowest and highest Coefficient of Lift from the generated points
    const [alphaOfHighestCl, highestCz] = newCl.reduce((previous, current) =>
      current[1] > previous[1] ? current : previous
    );

    const [alphaOfLowestCl, lowestCz] = newCl.reduce((previous, current) =>
      current[1] < previous[1] ? current : previous
    );

    let cd = profiles[profile].cd
      .map((array) => [array[0], array[i]])
      .filter(([x, y]) => y !== 0 && y !== null) as number[][];

    const clRange = highestCz - lowestCz;
    // const clRangeOfCd = cd[cd.length - 1][0] - cd[0][0];

    const diffs = cd.map(([x, y], index) => [
      x - (cd[index - 1] || [0, 0])[0],
      y - (cd[index - 1] || [0, 0])[1],
    ]);

    //add tangent as the last column
    cd = cd.map(([x, y], index) => [
      x,
      y,
      (x - (cd[index - 1] || [0, 0])[0]) / (y - (cd[index - 1] || [0, 0])[1]),
    ]);

    let czOfMaxCd = cd[cd.length - 1][0];
    let maxCd = cd[cd.length - 1][1];
    const dCz =
      cd[Math.floor(diffs.length / 2)][0] -
      cd[Math.floor(diffs.length / 2) - 1][0];
    const endTangent = [];

    let czOfMinCd = cd[0][0];
    let minCd = cd[0][1];
    const startTangent = [];

    // See if the actual cl end (highest/lowest) of cd is inside
    // and within 5% of the cl range ->
    // check if Cl series has the stall curve
    if (!isWithin(endX, 2, alphaOfHighestCl)) {
      if (isWithin(czOfMaxCd, 0.05 * clRange, highestCz)) {
        cd = cd.filter(([cl]) => cl < highestCz - 0.05 * clRange);
        czOfMaxCd = cd[cd.length - 1][0];
        maxCd = cd[cd.length - 1][1];
      }
      // if (czOfMaxCd < highestCz) {
      let lastCd = maxCd;
      for (let i = czOfMaxCd + dCz; i <= highestCz - dCz; i += dCz) {
        // between the last tangent and 0
        const linearI = (highestCz - i) / (highestCz - czOfMaxCd);
        const dCd = linearI * cd[cd.length - 1][2];
        const newCd = dCz / dCd + lastCd;
        endTangent.push([i, newCd]);
        lastCd = newCd;
      }
      // }
    }

    if (!isWithin(startX, 2, alphaOfLowestCl)) {
      if (isWithin(czOfMinCd, 0.05 * clRange, lowestCz)) {
        cd = cd.filter(([cl]) => lowestCz + 0.05 * clRange < cl);
        czOfMinCd = cd[0][0];
        minCd = cd[0][1];
      }
      let lastCd = minCd;
      for (let i = czOfMinCd - dCz; i > lowestCz + dCz; i -= dCz) {
        // between the last tangent and 0
        const linearI = -(lowestCz - i) / (lowestCz - czOfMinCd);
        const dCd = linearI * cd[1][2];
        const newCd = dCz / dCd + lastCd;
        startTangent.push([i, newCd]);
        lastCd = newCd;
      }
    }

    let newCd = generatePoints(
      lowestCz,
      highestCz,
      [...startTangent.toReversed(), ...cd, ...endTangent],
      true
    );
    result.cz.push(newCl);
    result.cd.push(newCd);
  }

  return result;
};

const getMinMaxData = (coeffs: Record<string, number[][][]>) => {
  let result: Record<string, number>[] = [];
  for (let i = 0; i < 3; i++) {
    const cz = coeffs.cz[i];
    const cd = coeffs.cd[i];

    const highestCz = cz.reduce((previous, current) =>
      current[1] > previous[1] ? current : previous
    );
    let lowestCz = cz.reduce((previous, current) =>
      current[1] < previous[1] ? current : previous
    );

    let lowestCd = cd.reduce((previous, current) =>
      current[1] < previous[1] ? current : previous
    );

    const angleOfZeroCl = linearInterpolationArray(
      cz.slice(20, 80).map(([x, y]) => [y, x]),
      0
    );

    const CdOfZeroCl = linearInterpolationArray(cd, 0);

    const slope = (linearRegression(cz.slice(20, 70)) * 180) / Math.PI;

    const info = {
      maxCz: highestCz[1],
      angleOfMaxCz: highestCz[0],
      minCz: lowestCz[1],
      angleOfMinCz: lowestCz[0],
      angleOfZeroCl,
      minCd: lowestCd[1],
      CdOfZeroCl,
      czOfMinCd: lowestCd[0],
      slope,
      minAngle: cz[0][0],
      maxAngle: cz[cz.length - 1][0],
    };

    result.push(info);
  }

  return result;
};

const generate_coefficients = () => {
  let newProfiles: Record<
    string,
    Record<string, number[][][] | number | number[]>
  > = {};
  let table: Record<string, Record<string, number>[]> = {};
  Object.keys(profiles).forEach((profile) => {
    const coeffs = getBetterCoefficients(profile);
    newProfiles[profile] = coeffs;
    table[profile] = getMinMaxData(coeffs);
  });
  console.log(newProfiles, table);
};

export const symmetrical_fixer = () => {
  // const zeroAngle = profiles["0009"].cz.find(
  //   ([x]) => parseFloat(x?.toFixed(1) || "1") === 0
  // ) as number[];
  // const fixed = profiles["0009"].cz.map(([x, y1, y2, y3]) => [
  //   x,
  //   y1 !== null ? y1 - zeroAngle[1] : null,
  //   y2 !== null ? y2 - zeroAngle[2] : null,
  //   y3 !== null ? y3 - zeroAngle[3] : null,
  // ]);
  // console.log(zeroAngle, fixed);
  // unused idea with changing interpolated points
  const deltas = [0];
  for (let i = 1; i <= 3; i++) {
    const points = profilesInterpolated["0009"].cz[i - 1].map(([x, y]) => [
      x,
      y,
      0,
    ]);
    deltas.push(linearInterpolationArray(points, 0));
  }
  const fixed = profiles["0009"].cz.map(([x, y1, y2, y3]) => [
    x,
    y1 ? round(y1 - deltas[1], 1e-5) : null,
    y2 ? round(y2 - deltas[2], 1e-5) : null,
    y3 ? round(y3 - deltas[3], 1e-5) : null,
  ]);
  console.log(fixed);
};

export default generate_coefficients;
