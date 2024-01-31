import { Props } from "../../common/types/three";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import LineChart from "../../common/three/LineChart";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import useResultsCharts, {
  useResultsChartStore,
} from "../hooks/useResultsChart";
import Legend from "../../common/three/Legend";

const ResultsUI = ({ opacity }: Props) => {
  const cl = usePlaneCoefficientsStore((state) => state.cl);
  const k = usePlaneCoefficientsStore((state) => state.k);
  const cd = usePlaneCoefficientsStore((state) => state.cd);

  useResultsCharts();

  return (
    <mesh rotation={[(-20 * Math.PI) / 180, (0 * Math.PI) / 180, 0, "YXZ"]}>
      <LineChart
        width={0.5}
        gridPositionX={0.35}
        opacity={opacity}
        name="Coefficient of Lift"
        traces={[
          { name: "Plane", points: cl },
          {
            name: "K",
            points: k.map(([x, y, z]) => [x, y / 10, z]),
            style: "dotted",
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
            name: "",
            min: -1.75,
            max: 1.75,
          },
        }}
        store={useResultsChartStore}
      />
      <Legend
        gridPositionX={0.9}
        items={[
          {
            name: (
              <HoverableFormulaSimple
                className="text-lg"
                name="Coefficient of Lift"
                tex="C_L"
              />
            ),
          },
          {
            name: (
              <HoverableFormulaSimple
                className="text-xl"
                name="Lift To Drag Ratio"
                tex="\frac{L}{D} / 10"
              />
            ),
            style: "dotted",
          },
        ]}
        opacity={opacity}
      />
      <LineChart
        width={0.5}
        gridPositionX={1.55}
        opacity={opacity}
        name="Coefficient of Drag"
        traces={[
          { name: "Plane", points: cd },
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
        store={useResultsChartStore}
      />
    </mesh>
  );
};

export default ResultsUI;
