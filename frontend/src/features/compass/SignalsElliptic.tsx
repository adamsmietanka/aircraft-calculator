import { useEffect, useState } from "react";
import AnimatedLine from "../common/three/AnimatedLine";
import {
  SpringValue,
  animated,
  easings,
  to,
  useSpring,
} from "@react-spring/three";
import { useCompassStore } from "./stores/useCompass";
import { useEllipseStore } from "./stores/useEllipse";

interface SignalsProps {
  opacity: SpringValue<number>;
}

const circle = Array.from(Array(41).keys()).map((i) => [
  Math.cos((i / 20) * Math.PI),
  Math.sin((i / 20) * Math.PI),
  0,
]);

const SIGNAL_SIZE = 2.5;
const SIGNAL_VEL = 5e-4;
const SIGNAL_DURATION = SIGNAL_SIZE / SIGNAL_VEL;

const SignalsElliptic = ({ opacity }: SignalsProps) => {
  const counter = useCompassStore((state) => state.counter);
  const timedelta = useEllipseStore((state) => state.timedelta);
  const ACdelta = useEllipseStore((state) => state.ACdelta);
  const A = useEllipseStore((state) => state.A);
  const B = useEllipseStore((state) => state.B);
  const C = useEllipseStore((state) => state.C);

  const x = useEllipseStore((state) => state.x);
  const y = useEllipseStore((state) => state.y);

  const [spring, api] = useSpring(
    () => ({
      sizeA: 0,
      sizeB: 0,
      sizeC: 0,
      opacityA: 1,
      opacityB: 1,
      opacityC: 1,
      config: {
        easing: easings.linear,
        duration: SIGNAL_DURATION,
      },
    }),
    []
  );

  useEffect(() => {
    api.start({
      sizeA: 0,
      sizeB: 0,
      sizeC: 0,
      opacityA: 1,
      opacityB: 1,
      opacityC: 1,
      immediate: true,
    });
    if (counter > 0) {
      api.start({
        sizeB: SIGNAL_SIZE,
        sizeC: SIGNAL_SIZE,
        opacityB: 0,
        opacityC: 0,
      });
      api.start({
        sizeA: SIGNAL_SIZE,
        opacityA: 0,
        delay: Math.hypot(x, y) / SIGNAL_VEL,
      });
    }
  }, [counter]);

  return (
    <>
      <animated.mesh
        position-x={x + A.x}
        position-y={y + A.y}
        scale={spring.sizeA}
      >
        <AnimatedLine
          points={circle}
          style="thin"
          color="grid"
          opacity={to([opacity, spring.opacityA], (o, opacity) => o * opacity)}
        />
      </animated.mesh>
      <animated.mesh position-x={A.x} position-y={A.y} scale={spring.sizeB}>
        <AnimatedLine
          points={circle}
          style="thin"
          color="grid"
          opacity={to([opacity, spring.opacityB], (o, opacity) => o * opacity)}
        />
      </animated.mesh>
      {/* <animated.mesh position-x={A.x} position-y={A.y} scale={spring.sizeC}>
        <AnimatedLine
          points={circle}
          style="thin"
          color="grid"
          opacity={to([opacity, spring.opacityC], (o, opacity) => o * opacity)}
        />
      </animated.mesh> */}
    </>
  );
};

export default SignalsElliptic;
