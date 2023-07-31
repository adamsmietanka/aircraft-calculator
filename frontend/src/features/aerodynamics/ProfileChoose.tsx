import React, { useEffect, useMemo } from "react";
import profiles from "./data/profiles";
import { Canvas } from "@react-three/fiber";
import LineChart from "../power_unit/three/LineChart";
import { useWingStore } from "./stores/useWing";
import useProfile from "./hooks/useProfile";
import ShapeVisualizer from "./three/ShapeVisualizer";

const Profile = () => {
  const { profilePoints, chordPoints } = useProfile();

  return (
    <div className="h-96 w-2/5">
      <Canvas orthographic camera={{ zoom: 30 }}>
        <ShapeVisualizer
          traces={[
            { name: "Outline", points: profilePoints },
            { name: "Chord", points: chordPoints },
          ]}
        />
      </Canvas>
    </div>
  );
};

const ProfileTable = () => {
  const wing = useWingStore();

  const tableData = useMemo(() => {
    return Object.keys(profiles).map((profile) => {
      const cz = profiles[profile].cz;
      const highest = cz.reduce((previous, current) => {
        if (current[1] > previous[1]) {
          return current;
        }
        return previous;
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
                wing.profile === row.name && "bg-base-200"
              } cursor-pointer`}
              onClick={() => wing.setProfile(row.name)}
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

  const points = useMemo(() => {
    const filtered = profiles[wing.profile].cz.filter(
      ([x]) => -5 < x && x < 15
    );
    return filtered.map(([x, y, y2]) => [x, y, 0]);
  }, [wing.profile]);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">Profile</span>
      </label>
      <select className="select select-bordered join-item w-60">
        <option disabled selected>
          Filter
        </option>
        <option>Sci-fi</option>
        <option>Drama</option>
        <option>Action</option>
      </select>
    </div>
  );
};

export default ProfileChoose;