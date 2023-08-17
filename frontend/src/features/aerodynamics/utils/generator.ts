import {
  findUpperBound,
  linearInterpolation,
} from "../../../utils/interpolation/binarySearch";
import profiles from "../data/profiles";

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
    console.log(extrapolate);
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

export default generate_coefficients;