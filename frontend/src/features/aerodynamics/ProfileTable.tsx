import { useWingStore } from "./stores/useWing";
import useProfileTable, { Row } from "./hooks/useProfileTable";
import Formula from "../common/Formula";
import HoverableFormulaSimple from "../common/HoverableFormulaSimple";

const ProfileTable = () => {
  const wing = useWingStore();
  const table = useProfileTable(wing.reynoldsIndex) as Row[];

  return (
    <div className="">
      <table className="table ">
        {/* head */}
        <thead>
          <tr>
            <th>Profile</th>
            <th>
              <Formula tex="C_{L_{max}}" className="text-lg" />
            </th>
            <th>
              <Formula tex="\alpha(L_{max})" className="text-lg" />
            </th>
            <th>
              <HoverableFormulaSimple
                className="text-lg"
                name="Angle of zero lift"
                tex="\alpha_0"
              />
            </th>
            <th>
              <Formula tex="C_{D_{min}}" className="text-lg" />
            </th>
            <th>
              <Formula tex="C_L(D_{min})" className="text-lg" />
            </th>
            <th>
              <Formula
                tex="\frac{dC_L}{d\alpha}[\frac{1}{rad}]"
                className="text-xl"
              />
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th>NACA 4-series</th>
          </tr>
        </thead>
        <tbody>
          {table.map(
            (row) =>
              row.name.length === 4 && (
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
                  <td>
                    {row.name.startsWith("00")
                      ? 0
                      : row.angleOfZeroCl.toFixed(2)}
                    °
                  </td>
                  <td>{row.minCd.toFixed(4)}</td>
                  <td>
                    {row.name.startsWith("00") ? 0 : row.czOfMinCd.toFixed(2)}
                  </td>
                  <td>{row.slope.toFixed(2)}</td>
                </tr>
              )
          )}
        </tbody>
        <thead>
          <tr>
            <th>NACA 5-series</th>
          </tr>
        </thead>
        <tbody>
          {table.map(
            (row) =>
              row.name.length === 5 && (
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
                  <td>{row.slope.toFixed(2)}</td>
                </tr>
              )
          )}
        </tbody>
        <thead>
          <tr>
            <th>Flat plates</th>
          </tr>
        </thead>
        <tbody>
          {table.map(
            (row) =>
              row.name.length === 2 && (
                <tr
                  key={row.name}
                  className={`${
                    wing.profile === row.name && "bg-base-200"
                  } cursor-pointer`}
                  onClick={() => wing.setProfile(row.name)}
                >
                  <td>{parseFloat(row.name)}% thick</td>
                  <td>{row.maxCz.toFixed(3)}</td>
                  <td>{row.angleOfMaxCz.toFixed(1)}°</td>
                  <td>
                    {parseFloat(row.angleOfZeroCl.toFixed(2)) !== 0
                      ? row.angleOfZeroCl.toFixed(2)
                      : 0}
                    °
                  </td>
                  <td>{row.minCd.toFixed(4)}</td>
                  <td>
                    {parseFloat(row.czOfMinCd.toFixed(2)) !== 0
                      ? row.czOfMinCd.toFixed(2)
                      : 0}
                  </td>
                  <td>{row.slope.toFixed(2)}</td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileTable;
