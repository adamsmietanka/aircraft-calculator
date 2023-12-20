import InputUnits from "../../common/inputs/InputUnits";
import WingMaterial from "../WingMaterial";
import InputNumber from "../../common/inputs/InputNumber";
import Wing3D from "./Wing3D";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import useWingAerodynamics from "../hooks/useWingAerodynamics";
import { useWingStore } from "../stores/useWing";
import { SpringValue } from "@react-spring/three";
import LineChart from "../../common/three/LineChart";
import Legend from "../../common/three/Legend";
import WingShape from "../WingShape";
import useWingCharts from "../hooks/useWingCharts";
import { WING_POSITION } from "../../common/three/config";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";

interface Props {
  opacity: SpringValue<number>;
}

const Wing = ({ opacity }: Props) => {
  const wing = useWingStore();
  const { stallReynolds, profileCl, profileCd, inducedCd, wingCl, wingCd } =
    useWingAerodynamics();

  const { useWingChartsStore } = useWingCharts();

  return (
    <>
      <Wing3D width={0.33} gridPositionX={WING_POSITION} opacity={opacity} />

      <mesh rotation-x={-Math.PI / 2}>
        <Inputs3D gridPositionX={-1.3}>
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
          width={0.35}
          gridPositionX={0.15}
          opacity={opacity}
          name="Coefficient of Lift"
          traces={[
            { name: "Wing", points: wingCl },
            { name: "Profile", points: profileCl, style: "dotted" },
          ]}
          axes={{
            x: {
              symbol: (
                <HoverableFormulaSimple
                  className="text-lg"
                  name="Angle of attack"
                  tex="\alpha"
                  texHover="\alpha \: [\degree]"
                />
              ),
              name: "Angle of Attack",
              min: -20,
              max: 20,
            },
            y: {
              symbol: (
                <HoverableFormulaSimple
                  className="text-lg"
                  name="Coefficient of Lift"
                  tex="C_L"
                />
              ),
              name: "Coefficient of Lift (Cl)",
              min: -1.75,
              max: 1.75,
            },
          }}
          store={useWingChartsStore}
        />
        <LineChart
          width={0.5}
          gridPositionX={1}
          opacity={opacity}
          name="Coefficient of Drag"
          traces={[
            { name: "Wing", points: wingCd },
            { name: "Induced", points: inducedCd, style: "thinDashed" },
            { name: "Profile", points: profileCd, style: "dotted" },
          ]}
          axes={{
            x: {
              symbol: (
                <HoverableFormulaSimple
                  className="text-lg"
                  name="Coefficient of Drag"
                  tex="C_D"
                />
              ),
              name: "Coefficient of Drag (Cd)",
              min: 0,
            },
            y: {
              symbol: (
                <HoverableFormulaSimple
                  className="text-lg"
                  name="Coefficient of Lift"
                  tex="C_L"
                />
              ),
              name: "Cl",
              min: -1.75,
              max: 1.75,
            },
          }}
          yHover
          store={useWingChartsStore}
        />
        <Legend
          gridPositionX={1.6}
          items={[
            { name: "Wing" },
            { name: "Induced", style: "thinDashed" },
            { name: "Profile", style: "dotted" },
          ]}
          opacity={opacity}
          store={useWingChartsStore}
        />
      </mesh>
    </>
  );
};

export default Wing;
