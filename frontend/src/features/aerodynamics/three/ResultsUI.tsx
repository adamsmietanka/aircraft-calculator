import { Props } from "../../common/types/three";
import LineChart from "../../common/three/LineChart";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { usePlaneStore } from "../stores/usePlane";
import useKChart, { useKChartStore } from "../hooks/useKChart";
import Legend from "../../common/three/Legend";
import useGlideChart, { useGlideChartStore } from "../hooks/useGlideChart";

const HorizontalUI = ({ opacity }: Props) => {
  const kMax = usePlaneStore((state) => state.kMax);

  const k = usePlaneCoefficientsStore((state) => state.k);

  useKChart();
  useGlideChart();

  return (
    <mesh rotation={[(-45 * Math.PI) / 180, (0 * Math.PI) / 180, 0, "YXZ"]}>
      <LineChart
        width={0.35}
        height={0.5}
        gridPositionX={0.15}
        opacity={opacity}
        name="Coefficient of Lift"
        traces={[
          { name: "K", points: k },
          // { name: "Stabilizer", points: clHorizontal, style: "dotted" },
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
                className="text-2xl"
                name="Lift To Drag Ratio"
                tex="\frac{C_L}{C_D}"
              />
            ),
            name: "Coefficient of Lift (Cl)",
            // min: -1.75,
            // max: 1.75,
          },
        }}
        store={useKChartStore}
      />
      <LineChart
        width={0.5}
        height={0.5}
        gridPositionX={1}
        opacity={opacity}
        name="Coefficient of Drag"
        traces={[
          {
            name: "Optimal",
            points: [
              [0, 1, 0],
              [kMax, 0, 0],
            ],
            style: "dotted",
          },
          {
            name: "Current",
            points: [
              [0, 1, 0],
              [useKChartStore.getState().y, 0, 0],
            ],
            style: "normal",
          },
        ]}
        axes={{
          x: {
            type: "altitude",
            name: "Distance",
            min: 0,
          },
          y: {
            type: "altitude",
            name: "Altitude",
            min: 0,
            max: 1.25,
          },
        }}
        store={useGlideChartStore}
      />
      <Legend
        gridPositionX={1.6}
        items={[{ name: "Optimal", style: "dotted" }, { name: "Current" }]}
        opacity={opacity}
        store={useGlideChartStore}
      />
    </mesh>
  );
};

export default HorizontalUI;