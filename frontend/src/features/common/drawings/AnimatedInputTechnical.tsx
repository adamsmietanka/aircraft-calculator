import { animated, to, useSpring } from "@react-spring/three";
import { ReactNode, useMemo } from "react";
import AnimatedLine from "../three/AnimatedLine";
import AnimatedTipNew from "./AnimatedTipNew";
import AnimatedHtml from "../three/AnimatedHtml";
import { VECTOR_TIP_LENGTH } from "../three/config";

interface Props {
  scale: number;
  value: number;
  valueY?: number;
  startX?: number;
  opacity: number;
  distance?: number;
  vertical?: boolean;
  outside?: boolean;
  children?: ReactNode;
}

const STICK_OUT = 0.2;

/**
 * Generic technical input in 3D. It needs to be in **world scale**.
 * X is always parallel to the line with arrows
 *
 * It will start at [0,0,0] and go to [value,0,0]
 */
const AnimatedInputTechnical = ({
  scale,
  value,
  valueY = 0,
  startX = 0,
  opacity,
  distance = 1,
  vertical = false,
  outside = false,
  children,
}: Props) => {
  const [inputSpring] = useSpring(
    () => ({
      opacity,
      scale,
      value,
      startX,
    }),
    [opacity, scale, value, startX]
  );
  const autoOutside = outside || value * scale < 1.25;

  const outsideStickOut = useMemo(() => (value === 0 ? 0.75 : 1.5), [value]);

  return (
    <animated.mesh rotation-z={vertical ? Math.PI / 2 : 0}>
      <animated.mesh position-x={inputSpring.startX.to((x) => x * scale)}>
        <AnimatedLine
          points={[
            [0, 0, 0],
            [0, (distance + Math.sign(distance) * STICK_OUT) / scale, 0],
            [0, distance / scale, 0],
            [
              value + (autoOutside ? outsideStickOut / scale : 0),
              distance / scale,
              0,
            ],
            [value, (distance + Math.sign(distance) * STICK_OUT) / scale, 0],
            [value, valueY, 0],
          ]}
          scale={[scale, scale, scale]}
          opacity={opacity}
          style="thin"
          color="grid"
          segments
        />
        <AnimatedTipNew
          distance={distance}
          opacity={inputSpring.opacity}
          scale={scale}
          outside={autoOutside}
        />
        <AnimatedTipNew
          distance={distance}
          opacity={inputSpring.opacity}
          scale={scale}
          value={value}
          outside={autoOutside}
        />

        <AnimatedHtml
          position={to(
            [inputSpring.value, inputSpring.scale],
            (value, scale) => [
              autoOutside
                ? scale * value + (VECTOR_TIP_LENGTH + outsideStickOut) / 2
                : (scale * value) / 2,
              0.3 + distance,
              0,
            ]
          )}
        >
          {children}
        </AnimatedHtml>
      </animated.mesh>
    </animated.mesh>
  );
};

export default AnimatedInputTechnical;
