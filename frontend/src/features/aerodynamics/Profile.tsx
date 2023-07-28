import React, { useEffect, useMemo } from "react";
import profiles from "./data/profiles";
import { Canvas } from "@react-three/fiber";
import LineChart from "../power_unit/three/LineChart";
import { useWingStore } from "./stores/useWing";
import useProfile from "./hooks/useProfile";
import ShapeVisualizer from "./three/ShapeVisualizer";

const ProfileOutline = () => {
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

const Profile = () => {
  const wing = useWingStore();

  const points = useMemo(() => {
    const filtered = profiles[wing.profile].cz.filter(
      ([x]) => -5 < x && x < 15
    );
    return filtered.map(([x, y, y2]) => [x, y, 0]);
  }, [wing.profile]);

  return (
    <div className="flex flex-col">
      <h3>Profile Catalog</h3>
      <div className="flex space-x-4">
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
        <ProfileOutline />
      </div>
    </div>
  );
};

export default Profile;
