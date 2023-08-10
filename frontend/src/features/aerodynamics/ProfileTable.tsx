import { useWingStore } from "./stores/useWing";
import useProfileTable, { Row } from "./hooks/useProfileTable";

const ProfileTable = () => {
  const wing = useWingStore();
  const table = useProfileTable(wing.reynolds) as Row[];

  return (
    <div className="">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Profile</th>
            <th>Max Cz</th>
            <th>Angle</th>
            <th>Angle of Zero Lift</th>
            <th>Min Cd</th>
            <th>Cz of Min Cd</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr
              key={row.name}
              className={`${
                wing.profile === row.name && "bg-base-200"
              } cursor-pointer`}
              onClick={() => wing.setProfile(row.name)}
            >
              <td>{row.name}</td>
              <td>{row.maxCz.toFixed(3)}</td>
              <td>{row.angleOfMaxCz.toFixed(1)}°</td>
              <td>{row.angleOfZeroCl.toFixed(2)}°</td>
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
