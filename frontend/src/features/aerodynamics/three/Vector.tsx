import { SpringValue, animated, to, useSpring } from "@react-spring/three";
import { Cone, Cylinder } from "@react-three/drei";
import { useCSSColors } from "../../common/three/config";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import { ReactNode } from "react";

const VECTOR_WIDTH = 0.05;
const VECTOR_TIP_LENGTH = 0.5;
const VECTOR_SIZE = 3.5;

interface VectorProps {
  value: number;
  otherValue?: number;
  rotation: SpringValue<number>;
  show: boolean;
  color?: string;
  opacity: SpringValue<number>;
  children: ReactNode;
}

const Vector = ({
  value,
  otherValue = 0,
  rotation,
  show,
  color = "primary",
  opacity,
  children,
}: VectorProps) => {
  const AnimatedCylinder = animated(Cylinder);
  const AnimatedCone = animated(Cone);

  const { colors } = useCSSColors();

  const [spring] = useSpring(
    () => ({
      value,
      textY: value * VECTOR_SIZE + (otherValue ? 0.1 : 0.5) * (value < 0 ? -1 : 1),
      otherDirection: otherValue ? Math.sign(otherValue) : 0,
      opacity: show && value !== 0 ? 1 : 0,
    }),
    [value, otherValue, show]
  );

  return (
    <animated.mesh rotation-z={rotation} position-z={0.2}>
      <AnimatedCylinder
        args={[VECTOR_WIDTH, VECTOR_WIDTH, 1, 32]}
        scale-x={spring.value.to((v) => Math.sqrt(Math.abs(v)))}
        scale-y={spring.value.to(
          (v) =>
            v * VECTOR_SIZE -
            Math.sign(v) * Math.sqrt(Math.abs(v)) * VECTOR_TIP_LENGTH
        )}
        position-y={spring.value.to(
          (v) =>
            (v * VECTOR_SIZE -
              Math.sign(v) * Math.sqrt(Math.abs(v)) * VECTOR_TIP_LENGTH) /
            2
        )}
        material-transparent
        material-color={colors[color]}
        material-opacity={to(
          [spring.opacity, opacity],
          (opacity, stepOpacity) => opacity * stepOpacity
        )}
      />
      <animated.mesh
        scale={spring.value.to((v) => Math.sign(v) * Math.sqrt(Math.abs(v)))}
        position-y={spring.value.to((v) => v * VECTOR_SIZE)}
      >
        <AnimatedCone
          args={[VECTOR_TIP_LENGTH / 2.5, VECTOR_TIP_LENGTH, 32]}
          position-y={-VECTOR_TIP_LENGTH / 2}
          // position-x={0.4}
          material-transparent
          material-color={colors[color]}
          material-opacity={to(
            [spring.opacity, opacity],
            (opacity, stepOpacity) => opacity * stepOpacity
          )}
        />
      </animated.mesh>
      <AnimatedHtml
        position-x={spring.otherDirection.to((dir) => -0.8 * dir)}
        position-y={spring.textY}
        rotation-z={rotation.to((r) => -r)}
        show={show}
      >
        <div className={`text-${color} text-xl`}>{children}</div>
      </AnimatedHtml>
    </animated.mesh>
  );
};

export default Vector;
