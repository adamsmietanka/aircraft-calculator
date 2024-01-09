import { useEffect } from "react";
import AnimatedLine from "../common/three/AnimatedLine";
import {
  SpringValue,
  animated,
  easings,
  to,
  useSpring,
} from "@react-spring/three";
import { useCompassStore } from "./stores/useCompass";

interface SignalsProps {
  opacity: SpringValue<number>;
  A: Record<string, number>;
  B: Record<string, number>;
  C: Record<string, number>;
}

const circle = Array.from(Array(41).keys()).map((i) => [
  Math.cos((i / 20) * Math.PI),
  Math.sin((i / 20) * Math.PI),
  0,
]);

const Signals = ({ A, B, C, opacity, ...props }: SignalsProps) => {
  const counter = useCompassStore((state) => state.counter);

  const [spring, api] = useSpring(
    () => ({
      from: { size: 0, opacity: 1 },
      config: {
        easing: easings.linear,
        duration: 5000,
      },
    }),
    []
  );
  useEffect(() => {
    api.start({
      to: async (next) => {
        await next({ size: 0, opacity: 1, immediate: true });
        await next({ size: 2, opacity: 0 });
      },
    });
  }, [counter]);

  return (
    <>
      <animated.mesh position-x={A.x} position-y={A.y} scale={spring.size}>
        <AnimatedLine
          points={circle}
          style="thin"
          color="grid"
          opacity={to([opacity, spring.opacity], (o, opacity) => o * opacity)}
        />
      </animated.mesh>
      <animated.mesh position-x={B.x} position-y={B.y} scale={spring.size}>
        <AnimatedLine
          points={circle}
          style="thin"
          color="grid"
          opacity={to([opacity, spring.opacity], (o, opacity) => o * opacity)}
        />
      </animated.mesh>
      <animated.mesh position-x={C.x} position-y={C.y} scale={spring.size}>
        <AnimatedLine
          points={circle}
          style="thin"
          color="grid"
          opacity={to([opacity, spring.opacity], (o, opacity) => o * opacity)}
        />
      </animated.mesh>
    </>
  );
};

export default Signals;
