import {
  findUpperBound,
  linearInterpolation,
} from "../../../utils/interpolation/binarySearch";
import profiles from "../data/profiles";

// 0 - this is the alpha/Cz or the x in the exported arrays
// 1 - is the trace for the lowest Re ~ 3 * 10^6
const INDEX_OF_COEFFICIENT = 2;
const NUMBER_OF_POINTS = 100;

const getCoefficients = (profile: string) => {
  const oldCz = profiles[profile].cz
    .map((array) => {
      if (array.length > 2) {
        return [array[0], array[INDEX_OF_COEFFICIENT]];
      }
      return array;
    })
    .filter(([x, y]) => y !== 0 && -20 <= x && x <= 20);
  const startX = oldCz[0][0];
  const endX = oldCz[oldCz.length - 1][0];

  let cz = [];
  let cd = [];

  let X = oldCz.map(([x, y]) => x);
  let Y = oldCz.map(([x, y]) => y);

  // generate 100x points
  for (let i = 0; i <= NUMBER_OF_POINTS; i++) {
    let x = startX + (i * (endX - startX)) / NUMBER_OF_POINTS;
    // fix floating point precision
    if (i === NUMBER_OF_POINTS) {
      x = endX;
    }
    const index = findUpperBound(X, x);
    const y = linearInterpolation(
      X[index],
      Y[index],
      X[index + 1],
      Y[index + 1],
      x
    );
    cz.push([x, y]);
  }

  // get lowest and highest Coefficient of Lift from the generated points
  const highestCz = cz.reduce((previous, current) =>
    current[1] > previous[1] ? current : previous
  )[1];

  const lowestCz = cz.reduce((previous, current) =>
    current[1] < previous[1] ? current : previous
  )[1];
  console.log(profiles);

  let oldCd = profiles[profile].cd
    .map((array) => {
      if (array.length > 2) {
        return [array[0], array[INDEX_OF_COEFFICIENT]];
      }
      return array;
    })
    .filter(([x, y]) => y !== 0);

  X = oldCd.map(([x, y]) => x);
  Y = oldCd.map(([x, y]) => y);

  // generate 100x cd points between min and max Coefficient of Lift
  for (let i = 0; i <= NUMBER_OF_POINTS; i++) {
    let x = lowestCz + (i * (highestCz - lowestCz)) / NUMBER_OF_POINTS;
    // fix floating point precision
    if (i === NUMBER_OF_POINTS) {
      x = highestCz;
    }
    const index = findUpperBound(X, x, true);
    console.log(
      findUpperBound([-22, -20, 0], 2, true),
      linearInterpolation(0, 0, 1, 1, 1.5)
    );
    const y = linearInterpolation(
      X[index - 1],
      Y[index - 1],
      X[index],
      Y[index],
      x
    );
    cd.push([x, y]);
  }
  // console.log(profile, cd, lowestCz, highestCz);

  return { cz, cd };
};

const generate_coefficients = () => {
  let newProfiles: Record<
    string,
    Record<string, number[][] | number | number[]>
  > = {};
  Object.keys(profiles).forEach((profile) => {
    newProfiles[profile] = getCoefficients(profile);
  });
  console.log(newProfiles);
};

export default generate_coefficients;

// const filtered = profiles[wing.profile].cz.filter(([x]) => -5 < x && x < 15);
