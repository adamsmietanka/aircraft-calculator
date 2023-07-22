import React, { useEffect, useMemo } from "react";
import profiles from "./data/profiles";
import { Canvas } from "@react-three/fiber";
import LineChart from "../power_unit/three/LineChart";
import { useWingStore } from "./stores/useWing";

const ProfileTable = () => {
  const wing = useWingStore();

  const tableData = useMemo(() => {
    return Object.keys(profiles).map((profile) => {
      const cz = profiles[profile].cz;
      const highest = cz.reduce((previous, current) => {
        if (current[1] > previous[1]) {
          return current;
        } else {
          return previous;
        }
      });
      return {
        name: profile,
        maxCz: highest[1],
        angleOfMaxCz: highest[0],
      };
    });
  }, []);
  return (
    <div className="">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Profile</th>
            <th>Max Cz</th>
            <th>Angle of Max Cz</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              className={`${
                wing.profile === parseInt(row.name) && "bg-base-200"
              } cursor-pointer`}
              onClick={() => wing.setProfile(parseInt(row.name))}
            >
              <td>{row.name}</td>
              <td>{row.maxCz.toFixed(2)}</td>
              <td>{row.angleOfMaxCz}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProfileChoose = () => {
  const wing = useWingStore();

//   useEffect(() => {
//     console.log(profiles[2415].cz.map(([x]) => x));
//   }, []);

  const points = useMemo(() => {
    // console.log(wing.profile);
    const filtered = profiles[wing.profile].cz.filter(
      ([x]) => -5 < x && x < 15
    );
    console.log(filtered.length);
    return filtered.map(([x, y, y2]) => [x, y, 0]);
  }, [wing.profile]);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">Profile</span>
      </label>
      <div className="join w-full">
        <select className="select select-bordered join-item w-60">
          <option disabled selected>
            Filter
          </option>
          <option>Sci-fi</option>
          <option>Drama</option>
          <option>Action</option>
        </select>
        <button
          className="btn join-item"
          onClick={() => (window as any).profile_modal.showModal()}
        >
          Catalog
        </button>
        <dialog id="profile_modal" className="modal">
          <form method="dialog" className="modal-box max-w-full max-h-full">
            <h3>Profile Catalog</h3>
            <div className="flex">
              <ProfileTable />
              <div className="h-96 w-2/5">
                <Canvas orthographic camera={{ zoom: 30 }}>
                  <LineChart
                    traces={[{ name: "Power", points }]}
                    xAxis={{ name: "Angle of Attack" }}
                    yAxis={{
                      name: "Cz",
                    }}
                  />
                </Canvas>
              </div>
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default ProfileChoose;
