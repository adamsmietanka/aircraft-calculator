import { useMemo } from "react";
import profiles from "../data/profiles_interpolated";
import { useWingStore } from "../stores/useWing";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";

export interface Row {
  name: string;
  maxCz: number;
  angleOfMaxCz: number;
  angleOfZeroCl: number;
  minCd: number;
  CdOfZeroCl: number;
  czOfMinCd: number;
  slope: number;
}

const linearRegression = (points: number[][]) => {
  const X = points.map(([x, y]) => x);
  const Y = points.map(([x, y]) => y);
  const x_mean = X.reduce((a, b) => a + b, 0) / X.length;
  const y_mean = Y.reduce((a, b) => a + b, 0) / Y.length;

  //Equations to solve for slope:
  let slope = 0,
    slope_numerator = 0,
    slope_denominator = 0;
  for (let i = 0; i < X.length; i++) {
    slope_numerator += (X[i] - x_mean) * (Y[i] - y_mean);
    slope_denominator += Math.pow(X[i] - x_mean, 2);
  }

  return slope_numerator / slope_denominator;
};

const useProfileTable = (index: number, profile?: string) => {
  const tableData = useMemo<Row[][]>(
    () =>
      [0, 1, 2].map((reynoldsIndex) => {
        let tableForReynolds = Object.keys(profiles).map((profile) => {
          const cz = profiles[profile].cz[reynoldsIndex];
          const cd = profiles[profile].cd[reynoldsIndex];

          const highestCz = cz.reduce((previous, current) =>
            current[1] > previous[1] ? current : previous
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

          return {
            name: profile,
            maxCz: highestCz[1],
            angleOfMaxCz: highestCz[0],
            angleOfZeroCl,
            minCd: lowestCd[1],
            CdOfZeroCl,
            czOfMinCd: lowestCd[0],
            slope,
          };
        });
        return tableForReynolds.sort((a, b) => a.name.localeCompare(b.name));
      }),
    []
  );

  return profile
    ? tableData[index].find((row) => row.name === profile)
    : tableData[index];
};
export default useProfileTable;
