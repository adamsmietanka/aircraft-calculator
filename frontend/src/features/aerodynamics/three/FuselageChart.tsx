import LineChart from "../../common/three/LineChart";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import Legend from "../../common/three/Legend";
import usePlaneCharts, { usePlaneChartStore } from "../hooks/usePlaneChart";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import { useWingCoefficientsStore } from "../stores/useWingCoefficients";
import { Props } from "../../common/types/three";

const FuselageChart = ({ opacity }: Props) => {
  const cd = usePlaneCoefficientsStore((state) => state.cd);
  const cdFuse = usePlaneCoefficientsStore((state) => state.cdFuse);
  const cdWing = useWingCoefficientsStore((state) => state.cd);

  usePlaneCharts();

  return (
    <>
      <LineChart
        width={0.5}
        gridPositionX={1}
        opacity={opacity}
        name="Coefficient of Drag"
        traces={[
          { name: "Plane", points: cd },
          { name: "Fuselage", points: cdFuse, style: "dotted" },
          { name: "Wing", points: cdWing, style: "thinDashed" },
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
        store={usePlaneChartStore}
      />
      <Legend
        gridPositionX={1.6}
        items={[
          { name: "Plane" },
          { name: "Fuselage", style: "dotted" },
          { name: "Wing", style: "thinDashed" },
        ]}
        opacity={opacity}
        store={usePlaneChartStore}
      />
    </>
  );
};

export default FuselageChart;
