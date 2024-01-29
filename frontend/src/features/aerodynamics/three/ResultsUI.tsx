import { Props } from "../../common/types/three";
import Inputs3D from "../../common/three/Inputs3D";
import { useHorizontalStore } from "../stores/useHorizontal";
import WingShape from "../WingShape";
import HorizontalChart from "./HorizontalChart";
import HorizontalPosition from "./HorizontalPosition";
import LineChart from "../../common/three/LineChart";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { usePlaneStore } from "../stores/usePlane";
import useGlideCharts, { useGlideChartStore } from "../hooks/useGlideChart";
import Legend from "../../common/three/Legend";

const HorizontalUI = ({ opacity }: Props) => {
  const shape = useHorizontalStore((state) => state.shape);
  const setShape = useHorizontalStore((state) => state.setShape);

  const kMax = usePlaneStore((state) => state.kMax);

  const k = usePlaneCoefficientsStore((state) => state.k);

  useGlideCharts();

  return (
    <mesh rotation={[(-45 * Math.PI) / 180, (0 * Math.PI) / 180, 0, "YXZ"]}>
      {/* <Inputs3D gridPositionX={-1.2}>
        <div className="w-48">
          <WingShape label="Stabilizer" shape={shape} setter={setShape} />
          <HorizontalPosition />
        </div>
      </Inputs3D> */}
      {/* <HorizontalChart opacity={opacity} /> */}
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
        store={useGlideChartStore}
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
          },
          {
            name: "Current",
            points: [
              [0, 1, 0],
              [useGlideChartStore.getState().y["Coefficient of Lift"], 0, 0],
            ],
            style: "dotted",
          },
          // { name: "Stabilizer", points: cdHorizontal, style: "dotted" },
        ]}
        axes={{
          x: {
            // symbol: (
            //   <HoverableFormulaSimple
            //     className="text-lg"
            //     name="Coefficient of Drag"
            //     tex="C_D"
            //   />
            // ),
            type: "altitude",
            name: "Distance",
            min: 0,
          },
          y: {
            // symbol: (
            //   <HoverableFormulaSimple
            //     className="text-lg"
            //     name="Coefficient of Lift"
            //     tex="C_L"
            //   />
            // ),
            type: "altitude",
            name: "Altitude",
            min: 0,
            max: 1.25,
          },
        }}
        yHover
        // store={useHorizontalChartStore}
      />
      <Legend
        gridPositionX={1.6}
        items={[{ name: "Optimal" }, { name: "Current", style: "dotted" }]}
        opacity={opacity}
        // store={useHorizontalChartStore}
      />
    </mesh>
  );
};

export default HorizontalUI;
