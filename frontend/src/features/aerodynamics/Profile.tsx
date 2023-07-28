import React, { useEffect, useMemo } from "react";
import profiles from "./data/profiles_interpolated";
import { Canvas } from "@react-three/fiber";
import LineChart from "../power_unit/three/LineChart";
import { useWingStore } from "./stores/useWing";
import useProfile from "./hooks/useProfile";
import ShapeVisualizer from "./three/ShapeVisualizer";
import generate_coefficients from "./utils/generator";

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
    <div className="h-full">
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
              <td>{row.maxCz.toFixed(3)}</td>
              <td>{row.angleOfMaxCz.toFixed(1)}</td>
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
    const filtered = profiles[wing.profile].cz;
    return filtered.map(([x, y, y2]) => [x, y, 0]);
  }, [wing.profile]);

  const pointsCd = useMemo(() => {
    const filtered = profiles[wing.profile].cd;
    return filtered.map(([x, y, y2]) => [x, y, 0]);
  }, [wing.profile]);

  useEffect(() => {
    generate_coefficients();
  });

  return (
      <div className="flex space-x-4 h-full">
        <ProfileTable />
        <div className="h-4/5 w-2/5">
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              traces={[{ name: "Power", points }]}
              xAxis={{ name: "Angle of Attack", min: -10, max: 20 }}
              yAxis={{
                name: "Cz",
                min: -1,
                max: 1.5,
              }}
            />
          </Canvas>
        </div>
        <div className="h-4/5 w-2/5">
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              traces={[{ name: "Power", points: pointsCd }]}
              xAxis={{ name: "Coefficient of Lift (Cl)", min: -1.5, max: 1.5 }}
              yAxis={{
                name: "Cd",
                min: 0,
                max: 0.02,
              }}
            />
          </Canvas>
        </div>
        <ProfileOutline />
      </div>
  );
};

export default Profile;
