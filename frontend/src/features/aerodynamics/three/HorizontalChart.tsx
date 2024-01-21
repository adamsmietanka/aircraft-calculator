import LineChart from "../../common/three/LineChart";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import Legend from "../../common/three/Legend";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import { Props } from "../../common/types/three";
import useVerticalCharts, {
  useVerticalChartStore,
} from "../hooks/useVerticalChart";

const HorizontalChart = ({ opacity }: Props) => {
  const cd = usePlaneCoefficientsStore((state) => state.cd);
  const cdVertical = usePlaneCoefficientsStore((state) => state.cdVertical);

  useVerticalCharts();

  return (
    <>
      <LineChart
        width={0.5}
        gridPositionX={1}
        opacity={opacity}
        name="Coefficient of Drag"
        traces={[
          { name: "Plane", points: cd },
          { name: "Stabilizer", points: cdVertical, style: "dotted" },
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
        store={useVerticalChartStore}
      />
      <Legend
        gridPositionX={1.6}
        items={[{ name: "Plane" }, { name: "Stabilizer", style: "dotted" }]}
        opacity={opacity}
        store={useVerticalChartStore}
      />
    </>
  );
};

export default HorizontalChart;
