import { Props } from "../../common/types/three";
import LineChart from "../../common/three/LineChart";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { usePlaneStore } from "../stores/usePlane";
import useKChart, { useKChartStore } from "../hooks/useKChart";
import Legend from "../../common/three/Legend";
import useGlideChart, { useGlideChartStore } from "../hooks/useGlideChart";
import PlaneModel from "./PlaneModel";
import { Resize } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";

const HorizontalUI = ({ opacity }: Props) => {
  const kMax = usePlaneStore((state) => state.kMax);
  const angleOpt = usePlaneStore((state) => state.angleOpt);

  const k = usePlaneCoefficientsStore((state) => state.k);
  const angle = useKChartStore((state) => state.x);
  const y = useKChartStore((state) => state.y);
  const legend = useGlideChartStore((state) => state.legend);

  useKChart();
  useGlideChart();

  const [spring] = useSpring(
    () => ({
      y:
        -Math.atan(1 / (legend === "Optimal" ? kMax : y)) +
        ((legend === "Optimal" ? angleOpt : angle) * Math.PI) / 180,
    }),
    [y, legend, angle, angleOpt]
  );

  return (
    <mesh rotation={[(-45 * Math.PI) / 180, (0 * Math.PI) / 180, 0, "YXZ"]}>
      <LineChart
        width={0.35}
        height={0.6}
        gridPositionX={-1.35}
        opacity={opacity}
        name="Coefficient of Lift"
        traces={[{ name: "K", points: k }]}
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
          },
        }}
        store={useKChartStore}
      />
      <LineChart
        width={1.25}
        height={0.6}
        gridPositionX={0.25}
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
              [y, 0, 0],
            ],
            style: "normal",
          },
        ]}
        axes={{
          x: {
            type: "altitude",
            name: "Glide Distance",
            min: 0,
          },
          y: {
            type: "altitude",
            name: "Altitude",
            min: 0,
            max: 1.25,
          },
        }}
        equalAxis
        store={useGlideChartStore}
      >
        <animated.mesh rotation-z={spring.y}>
          <Resize rotation={[0, Math.PI, 0]} scale={2.5}>
            <PlaneModel opacity={opacity} />
          </Resize>
        </animated.mesh>
      </LineChart>
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
