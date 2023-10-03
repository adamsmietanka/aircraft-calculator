import { animated, to, useSpring } from "@react-spring/three";
import { ReactNode, useMemo, useRef } from "react";
import AnimatedLine from "../three/AnimatedLine";
import AnimatedTipNew from "./AnimatedTipNew";
import AnimatedHtml from "../three/AnimatedHtml";
import { VECTOR_TIP_LENGTH } from "../three/config";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface Props {
  visible?: boolean;
  scale?: number;
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
 * Generic technical input in 3D.
 * X is always parallel to the line with arrows
 *
 * It will start at [startX,0,0] and go to [value,0,0]
 * 
 * @param {number} scale
 * Allows a consistent size of measurement tips and inputs.
 * Not needed when the scale of the parent component doesn't change. 
 * It'll be calculated automatically.
 */
const AnimatedInputTechnical = ({
  visible = true,
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
  const meshRef = useRef<Mesh>(null!);

  const worldScale = useMemo(() => new Vector3(1, 1, 1), []);
  const fluidScale = !!scale ? scale : worldScale.x;

  useFrame(() => {
    worldScale.setFromMatrixScale(meshRef.current.matrixWorld);
  });
  const autoOutside = outside || value * worldScale.x < 1.25;

  const outsideStickOut = useMemo(() => (value === 0 ? 0.75 : 1.5), [value]);

  const [inputSpring] = useSpring(
    () => ({
      opacity,
      value,
      startX,
      scale: fluidScale,
    }),
    [opacity, value, startX, fluidScale]
  );

  return (
    <animated.mesh
      rotation-z={vertical ? Math.PI / 2 : 0}
      ref={meshRef}
      visible={visible}
    >
      <animated.mesh position-x={inputSpring.startX}>
        <AnimatedLine
          points={[
            [0, 0, 0],
            [0, (distance + Math.sign(distance) * STICK_OUT) / fluidScale, 0],
            [0, distance / fluidScale, 0],
            [
              value + (autoOutside ? outsideStickOut / fluidScale : 0),
              distance / fluidScale,
              0,
            ],
            [
              value,
              (distance + Math.sign(distance) * STICK_OUT) / fluidScale,
              0,
            ],
            [value, valueY, 0],
          ]}
          opacity={opacity}
          style="thin"
          color="grid"
          segments
        />
        <AnimatedTipNew
          scale={fluidScale}
          distance={distance}
          opacity={inputSpring.opacity}
          outside={autoOutside}
        />
        <AnimatedTipNew
          scale={fluidScale}
          distance={distance}
          opacity={inputSpring.opacity}
          value={value}
          outside={autoOutside}
        />

        <AnimatedHtml
          position={to(
            [inputSpring.value, inputSpring.scale],
            (value, scale) => [
              autoOutside
                ? value + (VECTOR_TIP_LENGTH + outsideStickOut) / (2 * scale)
                : value / 2,
              (0.3 + distance) / scale,
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
