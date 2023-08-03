import React, { useEffect, useMemo } from "react";
import profiles from "./data/profiles_interpolated";
import { Canvas } from "@react-three/fiber";
import LineChart from "../power_unit/three/LineChart";
import { useWingStore } from "./stores/useWing";
import ProfileVisualizer from "./three/ProfileVisualizer";
import generate_coefficients from "./utils/generator";
import { create } from "zustand";
import { ChartStore } from "../power_unit/PowerUnitEngine";
import { linearInterpolationArray } from "../../utils/interpolation/binarySearchArray";

const ProfileTable = () => {
  const wing = useWingStore();

  const tableData = useMemo(() => {
    let table = Object.keys(profiles).map((profile) => {
      const cz = profiles[profile].cz;
      const cd = profiles[profile].cd;
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
  }, []);
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

export const useLiftStore = create<ChartStore>()((set) => ({
  x: 2,
  y: 2,
  hover: false,
  locked: false,
  setY: (value) => set((state) => ({ y: value })),
}));

const Profile = () => {
  const wing = useWingStore();

  const points = useMemo(() => {
    const filtered = profiles[wing.profile].cz;
    return filtered.map(([x, y, y2]) => [x, y, 0]);
  }, [wing.profile]);

  const pointsCd = useMemo(() => {
    const filtered = profiles[wing.profile].cd;
    return filtered.map(([x, y, y2]) => [x, y, 0]);
  }, [wing.profile]);

  const storeInstance = useLiftStore();

  useEffect(() => {
    const y = linearInterpolationArray(points, storeInstance.x);
    storeInstance.setY(y);
    console.log(storeInstance);
  }, [points, storeInstance.x]);

  useEffect(() => {
    generate_coefficients();
  }, []);

  return (
    <div className="flex space-x-4 h-full mt-4">
      <div className="flex flex-col">
        <ProfileTable />
        <div className="h-96">
          <Canvas orthographic camera={{ zoom: 30 }}>
            <ProfileVisualizer />
          </Canvas>
        </div>
      </div>
      <div className="flex w-full">
        <div className="sticky top-1/4 h-3/5 w-2/5" style={{ height: "82vh" }}>
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              traces={[{ name: "Power", points }]}
              axes={{
                x: { name: "Angle of Attack", min: -10, max: 20 },
                y: {
                  name: "Cl",
                  min: -1,
                  max: 1.5,
                },
              }}
              store={useLiftStore}
            />
          </Canvas>
        </div>
        <div className="sticky top-1/4 h-3/5 w-2/5" style={{ height: "82vh" }}>
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              traces={[{ name: "Power", points: pointsCd }]}
              axes={{
                x: {
                  name: "Coefficient of Lift (Cl)",
                  min: -1.5,
                  max: 1.5,
                },
                y: {
                  name: "Cd",
                  min: 0,
                  max: 0.02,
                },
              }}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default Profile;
