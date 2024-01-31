import { Props } from "../../common/types/three";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import LineChart from "../../common/three/LineChart";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import useResultsCharts, {
  useResultsChartStore,
} from "../hooks/useResultsChart";
import Legend from "../../common/three/Legend";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import { usePlaneStore } from "../stores/usePlane";
import HoverableFormula from "../../common/HoverableFormula";

const ResultsUI = ({ opacity }: Props) => {
  const cl = usePlaneCoefficientsStore((state) => state.cl);
  const k = usePlaneCoefficientsStore((state) => state.k);
  const cd = usePlaneCoefficientsStore((state) => state.cd);

  const kMax = usePlaneStore((state) => state.kMax);
  const angleOpt = usePlaneStore((state) => state.angleOpt);
  const cDmin = usePlaneStore((state) => state.cDmin);
  const clOfCdMin = usePlaneStore((state) => state.clOfCdMin);

  const setChart = useResultsChartStore((state) => state.set);

  useResultsCharts();

  return (
    <mesh rotation={[(-20 * Math.PI) / 180, (0 * Math.PI) / 180, 0, "YXZ"]}>
      <AnimatedHtml position-y={-5} position-x={-4}>
        <div className="text-2xl space-y-4">
          <HoverableFormula
            name="Glide Ratio"
            tex={`\\frac{L}{D}_{max}=${kMax.toFixed(2)}`}
            texHover={`\\frac{L}{D}_{max}=${kMax.toFixed(3)}`}
            hover={false}
            onEnter={() => setChart({ hover: true, xHover: angleOpt })}
            onLeave={() => setChart({ hover: false, xHover: 0 })}
          />
          <HoverableFormula
            name="Minimum Drag Coefficient"
            tex={`C_{D_{min}}=${cDmin.toFixed(4)}`}
            texHover={`C_{D_{min}}=${cDmin.toFixed(4)}`}
            hover={false}
            onEnter={() => setChart({ hover: true, yHover: clOfCdMin })}
            onLeave={() => setChart({ hover: false, yHover: 0 })}
          />
        </div>
      </AnimatedHtml>
      <LineChart
        width={0.4}
        gridPositionX={0.15}
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
        gridPositionX={0.62}
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
        gridPositionX={1.3}
        opacity={opacity}
        name="Coefficient of Drag"
        traces={[{ name: "Plane", points: cd }]}
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
