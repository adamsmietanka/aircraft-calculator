import React from "react";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import ProfileReynolds from "../ProfileReynolds";
import ProfileVisualizer from "./ProfileVisualizer";
import LineChart from "../../common/three/LineChart";
import useCamera from "./hooks/useCamera";
import useProfileCharts from "../hooks/useProfileCharts";
import Wing3D from "./Wing3D";
import { animated } from "@react-spring/three";
import { useLocation } from "react-router-dom";
import InputUnits from "../../common/inputs/InputUnits";
import WingMaterial from "../WingMaterial";
import InputNumber from "../../common/inputs/InputNumber";
import useWingAerodynamics from "../hooks/useWingAerodynamics";
import { useWingStore } from "../stores/useWing";
import SceneFuselage from "./SceneFuselage";

const Scene = () => {
  const { pointsCl, pointsCd, useProfileChartsStore } = useProfileCharts();
  const wing = useWingStore();
  const {
    area,
    aspectRatio,
    meanAerodynamicChord,
    stallReynolds,
    wingCl,
    wingCd,
  } = useWingAerodynamics();

  const location = useLocation();

  const onProfileStep = location.pathname === "/aerodynamics/profile";
  const onWingStep = location.pathname === "/aerodynamics/wing";

  const { s } = useCamera();
  return (
    <>
      <SceneFuselage opacity={s.opacityFuselage} />
      <Wing3D size={[0.33, 1]} gridPositionX={-1.33} opacity={s.opacityWing} />
      <mesh rotation-x={-Math.PI / 2} visible={true}>
        <Inputs3D size={[0.33, 1]} gridPositionX={-3.5} visible={onWingStep}>
          <ProfileChoose />
          <WingMaterial />
          <InputUnits
            label="Mean Aerodynamic Chord"
            type="length"
            disabled
            tooltip="MAC is the chord of a rectangular wing with the same area and span as those of the given wing"
            value={meanAerodynamicChord}
          />
          <InputUnits
            type="speed"
            value={wing.stallVelocity}
            setter={wing.setStallVelocity}
            min={30}
            label="Stall Velocity"
          />
          <InputNumber
            disabled
            value={stallReynolds / 1000000}
            label="Stall Reynolds Number"
            unit="10⁶"
          />
        </Inputs3D>
        <LineChart
          size={[0.33, 1]}
          gridPositionX={1}
          opacity={s.opacityWing}
          name="Coefficient of Lift"
          traces={[{ name: "Power", points: wingCl }]}
          axes={{
            x: { name: "Angle of Attack", min: -20, max: 20 },
            y: {
              name: "Coefficient of Lift (Cl)",
              min: -1.75,
              max: 1.75,
            },
          }}
          // store={useProfileChartsStore}
        />
        <LineChart
          size={[0.33, 1]}
          gridPositionX={3}
          opacity={s.opacityWing}
          name="Coefficient of Drag"
          traces={[{ name: "Power", points: wingCd }]}
          axes={{
            x: {
              name: "Coefficient of Drag (Cd)",
              min: 0,
            },
            y: {
              name: "Cl",
              min: -1.75,
              max: 1.75,
            },
          }}
          // store={useProfileChartsStore}
          // yHover
        />
      </mesh>
      <animated.mesh position-z={0}>
        <Inputs3D size={[0.33, 1]} gridPositionX={-3} visible={onProfileStep}>
          <ProfileChoose />
          <ProfileReynolds />
        </Inputs3D>
        {/* <OrbitControls /> */}
        <ProfileVisualizer
          size={[0.33, 1]}
          gridPositionX={-1.33}
          scale={s.scale}
          profileX={s.profileX}
          opacity={s.opacityProfile}
        />
        <LineChart
          size={[0.33, 1]}
          gridPositionX={1}
          opacity={s.opacityProfile}
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
          hoverEnabled={onProfileStep}
        />
        <LineChart
          size={[0.33, 1]}
          gridPositionX={3}
          opacity={s.opacityProfile}
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
          hoverEnabled={onProfileStep}
        />
      </animated.mesh>
    </>
  );
};

export default Scene;
