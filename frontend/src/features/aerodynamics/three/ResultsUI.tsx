import { Props } from "../../common/types/three";
import Inputs3D from "../../common/three/Inputs3D";
import { useHorizontalStore } from "../stores/useHorizontal";
import WingShape from "../WingShape";
import HorizontalChart from "./HorizontalChart";
import HorizontalPosition from "./HorizontalPosition";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import LineChart from "../../common/three/LineChart";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { useHorizontalChartStore } from "../hooks/useHorizontalChart";
import useResultsCharts, { useResultsChartStore } from "../hooks/useResultsChart";

const ResultsUI = ({ opacity }: Props) => {
  const shape = useHorizontalStore((state) => state.shape);
  const setShape = useHorizontalStore((state) => state.setShape);

  const cl = usePlaneCoefficientsStore((state) => state.cl);
  const cd = usePlaneCoefficientsStore((state) => state.cd);

  useResultsCharts();

  return (
    <mesh rotation={[(-20 * Math.PI) / 180, (0 * Math.PI) / 180, 0, "YXZ"]}>
      {/* <Inputs3D gridPositionX={-1.5}>
        <div className="w-48">
          <WingShape label="Stabilizer" shape={shape} setter={setShape} />
          <HorizontalPosition/>
        </div>
      </Inputs3D> */}
      <LineChart
        width={0.35}
        gridPositionX={0.35}
        opacity={opacity}
        name="Coefficient of Lift"
        traces={[
          { name: "Plane", points: cl },
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
        store={useResultsChartStore}
      />
      <LineChart
        width={0.5}
        gridPositionX={1.2}
        opacity={opacity}
        name="Coefficient of Drag"
        traces={[
          { name: "Plane", points: cd },
          // { name: "Stabilizer", points: cdHorizontal, style: "dotted" },
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
