import {
  CANVAS_WIDTH,
  NUMBER_OF_AIRFOIL_POINTS,
} from "../../common/three/config";
import { SpringValue, animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import Vector from "./Vector";
import AnimatedLine from "../../common/three/AnimatedLine";
import { useWingStore } from "../stores/useWing";
import { reynolds } from "../data/profiles";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import ProfileNACAExplanation from "./ProfileNACAExplanation";

interface Props {
  width: number;
  gridPositionX: number;
  opacity: SpringValue<number>;
}

const ProfileVisualizer = ({ width, gridPositionX, opacity }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const y = useProfileChartsStore((state) => state.y);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const { upperPoints, lowerPoints } = useProfile();

  const show =
    !!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"];

  const localWidth = CANVAS_WIDTH * width;

  const [profileSpring] = useSpring(
    () => ({
      aoa: show ? (-x["Coefficient of Lift"] * Math.PI) / 180 : 0,
    }),
    [x, show]
  );

  const profile = useWingStore((state) => state.profile);
  const reynoldsIndex = useWingStore((state) => state.reynolds);

  const speed = 0.03 * reynolds[profile][reynoldsIndex];

  const omittedPoints = Math.floor(NUMBER_OF_AIRFOIL_POINTS * 0.1);

  return (
    <animated.mesh position-x={(gridPositionX * CANVAS_WIDTH) / 2}>
      <Vector
        value={y["Coefficient of Lift"]}
        rotation={0}
        show={y["Coefficient of Lift"] !== 0 && show}
        opacity={opacity}
        color="primary"
      >
        <HoverableFormulaSimple
          name="Lift"
          tex={`F_L`}
          texHover={`F_L=\\frac{1}{2} \\rho V^2 S C_L`}
        />
      </Vector>
      <Vector
        value={50 * x["Coefficient of Drag"]}
        otherValue={y["Coefficient of Lift"]}
        rotation={-Math.PI / 2}
        show={show}
        opacity={opacity}
        color="error"
      >
        <HoverableFormulaSimple
          name="Drag"
          tex={`F_D`}
          texHover={` F_D=\\frac{1}{2} \\rho V^2 SC_D`}
        />
      </Vector>
      <animated.mesh rotation-z={profileSpring.aoa} scale={0.96 * localWidth}>
        <ProfileNACAExplanation scale={0.96 * localWidth} />
        <mesh position-x={-0.3}>
          <mesh position-y={0.02}>
            <AnimatedLine
              points={upperPoints.slice(
                omittedPoints,
                NUMBER_OF_AIRFOIL_POINTS - omittedPoints
              )}
              scale={[1.2, 1.2, 1]}
              style="airstream"
              color="grid"
              offset={speed}
              opacity={opacity.to((o) => (show ? o * 0.33 : 0))}
            />
          </mesh>
          <mesh position-y={-0.02}>
            <AnimatedLine
              points={lowerPoints.slice(
                omittedPoints,
                NUMBER_OF_AIRFOIL_POINTS - omittedPoints
              )}
              scale={[1.2, 1.2, 1]}
              style="airstream"
              color="grid"
              offset={0.8 * speed}
              opacity={opacity.to((o) => (show ? o * 0.33 : 0))}
            />
          </mesh>
        </mesh>
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileVisualizer;
