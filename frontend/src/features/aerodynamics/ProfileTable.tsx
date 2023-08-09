import { useMemo } from "react";
import { useWingStore } from "./stores/useWing";
import profiles from "./data/profiles_interpolated";

const ProfileTable = () => {
  const wing = useWingStore();

  const tableData = useMemo(() => {
    let table = Object.keys(profiles).map((profile) => {
      const cz = profiles[profile].cz[wing.reynolds];
      const cd = profiles[profile].cd[wing.reynolds];
      const highest = cz.reduce((previous, current) => {
        if (current[1] > previous[1]) {
          return current;
        }
        return previous;
      });
      let lowest = [0, 0.9];
      if (cd.length) {
        lowest = cd.reduce((previous, current) => {
          if (current[1] < previous[1]) {
            return current;
          }
          return previous;
        });
      }
      return {
        name: profile,
        maxCz: highest[1],
        angleOfMaxCz: highest[0],
        minCd: lowest[1],
        czOfMinCd: lowest[0],
      };
    });
    return table.sort((a, b) => a.name.localeCompare(b.name));
  }, [wing.reynolds]);

  return (
    <div className="">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Profile</th>
            <th>Max Cz</th>
            <th>Angle</th>
            <th>Min Cd</th>
            <th>Cz of Min Cd</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              className={`${
                wing.profile === row.name && "bg-base-200"
              } cursor-pointer`}
              onClick={() => wing.setProfile(row.name)}
            >
              <td>{row.name}</td>
              <td>{row.maxCz.toFixed(3)}</td>
              <td>{row.angleOfMaxCz.toFixed(1)}</td>
              <td>{row.minCd.toFixed(4)}</td>
              <td>{row.czOfMinCd.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileTable;
