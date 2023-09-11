import InputUnits from "../../common/inputs/InputUnits";
import WingMaterial from "../WingMaterial";
import InputNumber from "../../common/inputs/InputNumber";
import Wing3D from "./Wing3D";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import { useLocation } from "react-router-dom";
import useWingAerodynamics from "../hooks/useWingAerodynamics";
import { useWingStore } from "../stores/useWing";
import {
  SpringValue,
  config,
  useSpring,
} from "@react-spring/three";

interface Props {
  opacity: SpringValue<number>;
}

const SceneWing = () => {
  const wing = useWingStore();
  const { meanAerodynamicChord, stallReynolds, wingCl, wingCd } =
    useWingAerodynamics();

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
        {/* <LineChart
          size={[0.33, 1]}
          gridPositionX={1}
          opacity={ss.opacity}
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
          opacity={ss.opacity}
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
        /> */}
      </mesh>
    </>
  );
};

export default SceneWing;
