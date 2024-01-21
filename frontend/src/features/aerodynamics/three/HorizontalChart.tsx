import LineChart from "../../common/three/LineChart";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import Legend from "../../common/three/Legend";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import { Props } from "../../common/types/three";
import useHorizontalCharts, {
  useHorizontalChartStore,
} from "../hooks/useHorizontalChart";

const HorizontalChart = ({ opacity }: Props) => {
  const cl = usePlaneCoefficientsStore((state) => state.cl);
  const clHorizontal = usePlaneCoefficientsStore((state) => state.clHorizontal);
  const cd = usePlaneCoefficientsStore((state) => state.cd);
  const cdHorizontal = usePlaneCoefficientsStore((state) => state.cdHorizontal);

  useHorizontalCharts();

  return (
    <>
      {/* <LineChart
        width={0.35}
        gridPositionX={0.15}
        opacity={opacity}
        name="Coefficient of Lift"
        traces={[
          { name: "Plane", points: cl },
          { name: "Stabilizer", points: clHorizontal, style: "dotted" },
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
        store={useHorizontalChartStore}
      /> */}
      <LineChart
        width={0.5}
        gridPositionX={1}
        opacity={opacity}
        name="Coefficient of Drag"
        traces={[
          { name: "Plane", points: cd },
          { name: "Stabilizer", points: cdHorizontal, style: "dotted" },
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
        store={useHorizontalChartStore}
      />
      <Legend
        gridPositionX={1.6}
        items={[{ name: "Plane" }, { name: "Stabilizer", style: "dotted" }]}
        opacity={opacity}
        store={useHorizontalChartStore}
      />
    </>
  );
};

export default HorizontalChart;
