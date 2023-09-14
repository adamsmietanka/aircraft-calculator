import InputUnits from "../../common/inputs/InputUnits";
import WingMaterial from "../WingMaterial";
import InputNumber from "../../common/inputs/InputNumber";
import Wing3D from "./Wing3D";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import { useLocation } from "react-router-dom";
import useWingAerodynamics from "../hooks/useWingAerodynamics";
import { useWingStore } from "../stores/useWing";
import { SpringValue, config, useSpring } from "@react-spring/three";
import LineChart from "../../common/three/LineChart";
import Legend from "../../common/three/Legend";
import WingShape from "../WingShape";
import useWingCharts from "../hooks/useWingCharts";

interface Props {
  opacity: SpringValue<number>;
}

const SceneWing = () => {
  const wing = useWingStore();
  const {
    meanAerodynamicChord,
    stallReynolds,
    cl,
    cd,
    inducedCd,
    wingCl,
    wingCd,
  } = useWingAerodynamics();

  const { useWingChartsStore } = useWingCharts();

  const location = useLocation();

  const onWingStep = location.pathname === "/aerodynamics/wing";

  const [ss] = useSpring(
    () => ({
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
      config: config.slow,
    }),
    []
  );

  return (
    <>
      <Wing3D size={[0.33, 1]} gridPositionX={-1.33} opacity={ss.opacity} />

      <mesh rotation-x={-Math.PI / 2} visible={true}>
        <Inputs3D size={[0.33, 1]} gridPositionX={-3.9} visible={onWingStep}>
          <ProfileChoose />
          <WingShape />
          <WingMaterial />
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
          gridPositionX={0.8}
          opacity={ss.opacity}
          name="Coefficient of Lift"
          traces={[
            { name: "Wing", points: wingCl },
            { name: "Profile", points: cl, style: "dotted" },
          ]}
          axes={{
            x: { name: "Angle of Attack", min: -20, max: 20 },
            y: {
              name: "Coefficient of Lift (Cl)",
              min: -1.75,
              max: 1.75,
            },
          }}
          store={useWingChartsStore}
        />
        <LineChart
          size={[0.5, 1]}
          gridPositionX={2.1}
          opacity={ss.opacity}
          name="Coefficient of Drag"
          traces={[
            { name: "Wing", points: wingCd },
            { name: "Profile", points: cd, style: "dotted" },
            { name: "Induced", points: inducedCd, style: "thin" },
          ]}
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
          zHover
          store={useWingChartsStore}
        />
        <Legend
          size={[0.5, 1]}
          gridPositionX={3.2}
          items={[
            { name: "Wing" },
            { name: "Induced", style: "thin" },
            { name: "Profile", style: "dotted" },
          ]}
        />
      </mesh>
    </>
  );
};

export default SceneWing;
