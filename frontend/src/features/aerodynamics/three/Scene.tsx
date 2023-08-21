import React from "react";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import ProfileReynolds from "../ProfileReynolds";
import ProfileVisualizer from "./ProfileVisualizer";
import LineChart from "../../common/three/LineChart";
import useCamera from "../../common/three/hooks/useCamera";
import useProfileCharts from "../hooks/useProfileCharts";
import Wing3D from "./Wing3D";

const Scene = () => {
  const { pointsCl, pointsCd, useProfileChartsStore } = useProfileCharts();

  const { s } = useCamera();
  return (
    <>
      <Wing3D size={[0.33, 1]} gridPositionX={-1} opacity={s.opacityWing} />
      <mesh position-z={5}>
        <Inputs3D size={[0.33, 1]} gridPositionX={-3}>
          <ProfileChoose />
          <ProfileReynolds />
        </Inputs3D>
        {/* <OrbitControls /> */}
        <ProfileVisualizer size={[0.33, 1]} gridPositionX={-1} />
        <LineChart
          size={[0.33, 1]}
          gridPositionX={1}
          name="Coefficient of Lift"
          traces={[{ name: "Power", points: pointsCl }]}
          axes={{
            x: { name: "Angle of Attack", min: -20, max: 20 },
            y: {
              name: "Coefficient of Lift (Cl)",
              min: -1.75,
              max: 1.75,
            },
          }}
          store={useProfileChartsStore}
        />
        <LineChart
          size={[0.33, 1]}
          gridPositionX={3}
          name="Coefficient of Drag"
          traces={[{ name: "Power", points: pointsCd }]}
          axes={{
            x: {
              name: "Coefficient of Drag (Cd)",
              min: 0,
              max: 0.026,
            },
            y: {
              name: "Cl",
              min: -1.75,
              max: 1.75,
            },
          }}
          store={useProfileChartsStore}
          yHover
        />
      </mesh>
    </>
  );
};

export default Scene;
