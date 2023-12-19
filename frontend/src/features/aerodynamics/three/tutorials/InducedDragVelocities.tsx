import { useInducedDragStore } from "./stores/useInducedDrag";
import { Props } from "../../../common/types/three";
import { useWingStore } from "../../stores/useWing";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import useWingScale from "../../hooks/useWingScale";
import VectorNew from "../../../common/three/VectorNew";
import HoverableFormulaSimple from "../../../common/HoverableFormulaSimple";
import { animated, useSpring } from "@react-spring/three";
import useProfileVisualizer from "../hooks/useProfileVisualizer";
import AnimatedLine from "../../../common/three/AnimatedLine";

const InducedDragVelocities = ({ opacity }: Props) => {
  const isWing = useInducedDragStore((state) => state.isWing);
  const direction = useInducedDragStore((state) => state.direction);
  const velocities = useInducedDragStore((state) => state.velocities);

  const reynolds = useWingStore((state) => state.reynolds);
  const chart = useProfileChartsStore();

  const { scaleProfile } = useWingScale();
  const { profileSpring } = useProfileVisualizer();

  const speed = reynolds / 6;
  const spanWiseSpeed = 0.2 * chart.yHover * speed;

  const [spring, api] = useSpring(
    () => ({
      speed,
      epsilon: isWing ? Math.atan(spanWiseSpeed / speed) : 0,
      downwashX: speed,
    }),
    [isWing, spanWiseSpeed, speed]
  );

  return (
    <animated.mesh
      position-x={1}
      position-z={1}
      rotation-z={profileSpring.angle.to((a) => -a)}
    >
      <mesh scale={1 / scaleProfile}>
        <VectorNew
          x={speed / 3.5}
          show={velocities}
          opacity={opacity}
          color="primary"
        >
          <HoverableFormulaSimple name="Freeflow speed" tex="V" />
        </VectorNew>
        <animated.mesh position-x={spring.downwashX}>
          <VectorNew
            x={0}
            y={isWing ? -spanWiseSpeed / 3.5 : 0}
            show={velocities}
            opacity={opacity}
            color="error"
          >
            <HoverableFormulaSimple name="Downwash" tex="w" />
          </VectorNew>
        </animated.mesh>
      </mesh>
      <animated.mesh rotation-z={spring.epsilon.to((e) => -e)}>
        <AnimatedLine
          points={[
            [-1, 0, 0.01],
            [1, 0, 0.01],
          ]}
          style="dotted"
          color="grid"
          opacity={opacity.to((o) => (direction ? o * 0.25 : 0))}
        />
      </animated.mesh>
    </animated.mesh>
  );
};

export default InducedDragVelocities;
