import { useEffect, useState } from "react";
import AnimatedLine from "../common/three/AnimatedLine";
import { animated, easings, to, useSpring } from "@react-spring/three";
import { useCompassStore } from "./stores/useCompass";
import { Props } from "../common/types/three";

const circle = Array.from(Array(41).keys()).map((i) => [
  Math.cos((i / 20) * Math.PI),
  Math.sin((i / 20) * Math.PI),
  0,
]);

const SIGNAL_SIZE = 2.5;
const SIGNAL_VEL = 5e-4;
const SIGNAL_DURATION = SIGNAL_SIZE / SIGNAL_VEL;

const Signals = ({ opacity }: Props) => {
  const counter = useCompassStore((state) => state.counter);
  const timedelta = useCompassStore((state) => state.timedelta);
  const ACdelta = useCompassStore((state) => state.ACdelta);
  const A = useCompassStore((state) => state.A);
  const B = useCompassStore((state) => state.B);
  const C = useCompassStore((state) => state.C);

  const [delays, setDelays] = useState({ A: 0, B: 0, C: 0 });

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
    const deltas = [
      -timedelta - ACdelta,
      timedelta - ACdelta,
      -timedelta + ACdelta,
    ];
    console.log(deltas);
    const firstSignalTime = Math.min(...deltas);
    setDelays({
      A: (deltas[0] - firstSignalTime) / (10 * SIGNAL_VEL), //4
      B: (deltas[1] - firstSignalTime) / (10 * SIGNAL_VEL), //0
      C: (deltas[2] - firstSignalTime) / (10 * SIGNAL_VEL),
    });
  }, [timedelta, ACdelta]);

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
      if (counter % 2)
        api.start({
          sizeA: SIGNAL_SIZE,
          sizeB: SIGNAL_SIZE,
          sizeC: SIGNAL_SIZE,
          opacityA: 0,
          opacityB: 0,
          opacityC: 0,
        });
      else {
        api.start({
          sizeA: SIGNAL_SIZE,
          opacityA: 0,
          delay: delays.A,
        });
        api.start({
          sizeB: SIGNAL_SIZE,
          opacityB: 0,
          delay: delays.B,
        });
        api.start({
          sizeC: SIGNAL_SIZE,
          opacityC: 0,
          delay: delays.C,
        });
      }
    }
  }, [counter]);

  return (
    <>
      <animated.mesh position-x={A.x} position-y={A.y} scale={spring.sizeA}>
        <AnimatedLine
          points={circle}
          style="thin"
          color="grid"
          opacity={to([opacity, spring.opacityA], (o, opacity) => o * opacity)}
        />
      </animated.mesh>
      <animated.mesh position-x={B.x} position-y={B.y} scale={spring.sizeB}>
        <AnimatedLine
          points={circle}
          style="thin"
          color="grid"
          opacity={to([opacity, spring.opacityB], (o, opacity) => o * opacity)}
        />
      </animated.mesh>
      <animated.mesh position-x={C.x} position-y={C.y} scale={spring.sizeC}>
        <AnimatedLine
          points={circle}
          style="thin"
          color="grid"
          opacity={to([opacity, spring.opacityC], (o, opacity) => o * opacity)}
        />
      </animated.mesh>
    </>
  );
};

export default Signals;
