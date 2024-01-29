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
import useWingCharts, { useWingChartsStore } from "../hooks/useWingCharts";
import { WING_POSITION } from "../../common/three/config";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { useProfileCoefficientsStore } from "../stores/useProfileCoefficients";
import { useWingCoefficientsStore } from "../stores/useWingCoefficients";

interface Props {
  opacity: SpringValue<number>;
}

const Wing = ({ opacity }: Props) => {
  const stallVelocity = useWingStore((state) => state.stallVelocity);
  const setStallVelocity = useWingStore((state) => state.setStallVelocity);
  const stallReynolds = useWingStore((state) => state.stallReynolds);

  const shape = useWingStore((state) => state.shape);
  const setShape = useWingStore((state) => state.setShape);

  useWingAerodynamics();
  useWingCharts();

  const profileCl = useProfileCoefficientsStore((state) => state.cl);
  const profileCd = useProfileCoefficientsStore((state) => state.cd);

  const wingCl = useWingCoefficientsStore((state) => state.cl);
  const monotonic = useWingCoefficientsStore((state) => state.monotonic);
  const wingCd = useWingCoefficientsStore((state) => state.cd);
  const inducedCd = useWingCoefficientsStore((state) => state.cdInduced);

  const first = monotonic[1];
  const last = monotonic[monotonic.length - 2];

  return (
    <>
      <Wing3D width={0.33} gridPositionX={WING_POSITION} opacity={opacity} />

      <mesh rotation-x={-Math.PI / 2}>
        <Inputs3D gridPositionX={-1.3}>
          <ProfileChoose />
          <WingShape shape={shape} setter={setShape} />
          <WingMaterial />
          <InputUnits
            type="speed"
            value={stallVelocity}
            setter={setStallVelocity}
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
            {
              name: "asd",
              points: [
                [first[1], first[0], 0],
                [last[1], last[0], 0],
              ],
              style: "thin",
            },
          ]}
          axes={{
            x: {
              symbol: (
                <HoverableFormulaSimple
                  className="text-lg tooltip-right"
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
                  className="text-lg tooltip-right"
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
