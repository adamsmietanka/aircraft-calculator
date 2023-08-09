import { useMemo } from "react";
import profiles from "../data/profiles_interpolated";
import { useWingStore } from "../stores/useWing";

const useProfileTable = () => {
  const wing = useWingStore();

  const tableData = useMemo(() => {
    let table = [0, 1, 2].map((reynoldsIndex) => {
      let tableForReynolds = Object.keys(profiles).map((profile) => {
        const cz = profiles[profile].cz[reynoldsIndex];
        const cd = profiles[profile].cd[reynoldsIndex];
        const highest = cz.reduce((previous, current) =>
          current[1] > previous[1] ? current : previous
        );
        let lowest = [0, 0.9];
        if (cd.length) {
          lowest = cd.reduce((previous, current) =>
            current[1] < previous[1] ? current : previous
          );
        }
        return {
          name: profile,
          maxCz: highest[1],
          angleOfMaxCz: highest[0],
          minCd: lowest[1],
          czOfMinCd: lowest[0],
        };
      });
      return tableForReynolds.sort((a, b) => a.name.localeCompare(b.name));
    });
    return table;
  }, []);
  return { tableAllReynolds: tableData, table: tableData[wing.reynolds] };
};
export default useProfileTable;
