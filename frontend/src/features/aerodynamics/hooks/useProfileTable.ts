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
}

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

          return {
            name: profile,
            maxCz: highestCz[1],
            angleOfMaxCz: highestCz[0],
            angleOfZeroCl,
            minCd: lowestCd[1],
            CdOfZeroCl,
            czOfMinCd: lowestCd[0],
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
