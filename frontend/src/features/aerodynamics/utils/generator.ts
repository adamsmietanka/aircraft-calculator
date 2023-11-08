import {
  findUpperBound,
  linearInterpolation,
} from "../../../utils/interpolation/binarySearch";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import round from "../../../utils/interpolation/round";
import plate, { plates } from "../data/flatPlate";
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

const generate_coefficients = () => {
  let newProfiles: Record<
    string,
    Record<string, number[][][] | number | number[]>
  > = {};
  Object.keys(profiles).forEach((profile) => {
    newProfiles[profile] = getCoefficients(profile);
  });
  console.log(newProfiles);
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

export const plateGenerator = () => {
  let results: Record<string, Record<string, Array<Array<number | null>>>> = {};

  plates.forEach((p) => {
    const t = parseFloat(p) / 100;
    results[p] = {
      cz: plate.map(([aoa, cz]) => [aoa, cz, cz, cz]),
      cd: plate.map(([aoa, cz]) => {
        const cd =
          cz * Math.sin((aoa * Math.PI) / 180) +
          0.3 * t * Math.cos((aoa * Math.PI) / 180);
        return [cz, cd, cd, cd];
      }),
    };
  });
  console.log(results);
};

export default generate_coefficients;
