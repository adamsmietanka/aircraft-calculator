import {
  findUpperBound,
  linearInterpolation,
} from "../../../utils/interpolation/binarySearch";
import profiles from "../data/profiles";

// 0 - this is the alpha/Cz or the x in the exported arrays
// 1 - is the trace for the lowest Re ~ 3 * 10^6
const INDEX_OF_COEFFICIENT = 2;
const NUMBER_OF_POINTS = 100;

const getCz = (profile: string) => {
  const oldCz = profiles[profile].cz
    .map((array) => {
      if (array.length > 2) {
        return [array[0], array[INDEX_OF_COEFFICIENT]];
      }
      return array;
    })
    .filter(([x, y]) => y !== 0 && -10 <= x && x <= 20);
  const startX = oldCz[0][0];
  const endX = oldCz[oldCz.length - 1][0];

  let cz = [];

  const X = oldCz.map(([x, y]) => x);
  const Y = oldCz.map(([x, y]) => y);

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
  return cz;
};

const getCd = (profile: string) => {
  let oldCd = profiles[profile].cd;
  if (oldCd) {
    oldCd = oldCd
      .map((array) => {
        if (array.length > 2) {
          return [array[0], array[INDEX_OF_COEFFICIENT]];
        }
        return array;
      })
      .filter(([x, y]) => y !== 0);
    const startX = oldCd[0][0];
    const endX = oldCd[oldCd.length - 1][0];

    let cd = [];

    const X = oldCd.map(([x, y]) => x);
    const Y = oldCd.map(([x, y]) => y);

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
      cd.push([x, y]);
    }
    return cd;
  }
};

const generate_coefficients = () => {
  let newProfiles: Record<
    string,
    Record<string, number[][] | number | number[]>
  > = {};
  Object.keys(profiles).forEach((profile) => {
    const cz = getCz(profile);
    const cd = getCd(profile) || [];
    newProfiles[profile] = { cz, cd };
  });
  console.log(newProfiles);
};

export default generate_coefficients;

// const filtered = profiles[wing.profile].cz.filter(([x]) => -5 < x && x < 15);
