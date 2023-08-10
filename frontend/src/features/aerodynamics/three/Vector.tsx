import { animated, to, useSpring } from "@react-spring/three";
import { Cone, Cylinder, Text } from "@react-three/drei";
import { useCSSColors } from "../../common/three/config";

const VECTOR_MULTIPLIER = 0.2;
const VECTOR_WIDTH = 0.005;
const VECTOR_TIP_LENGTH = 0.04;

interface VectorProps {
  value: number;
  rotation: number;
  show: boolean;
  color?: string;
}

const Vector = ({ value, rotation, show, color }: VectorProps) => {
  const AnimatedCylinder = animated(Cylinder);
  const AnimatedCone = animated(Cone);
  const AnimatedText = animated(Text);

  const { primaryColor, secondaryColor } = useCSSColors();

  const [spring] = useSpring(
    () => ({
      value,
      direction: value > 0 ? 1 : -1,
      opacity: show ? 1 : 0,
    }),
    [value, show]
  );

  return (
    <mesh rotation-z={rotation} position-z={0.1}>
      <AnimatedCylinder
        args={[VECTOR_WIDTH, VECTOR_WIDTH, 1, 32]}
        scale-y={spring.value.to(
          (v) => VECTOR_MULTIPLIER * v - VECTOR_TIP_LENGTH
        )}
        position-y={spring.value.to(
          (v) => (VECTOR_MULTIPLIER * v - VECTOR_TIP_LENGTH) / 2
        )}
        material-color={color ? color : primaryColor}
        material-transparent
        material-opacity={spring.opacity}
      />
      <AnimatedCone
        args={[VECTOR_TIP_LENGTH / 2.5, VECTOR_TIP_LENGTH, 32]}
        position-y={spring.value.to(
          (v) => VECTOR_MULTIPLIER * v - VECTOR_TIP_LENGTH / 2
        )}
        rotation-z={spring.direction.to((dir) => ((1 - dir) * Math.PI) / 2)}
        material-color={color ? color : primaryColor}
        material-transparent
        material-opacity={spring.opacity}
      />
      <AnimatedText
        position-y={to(
          [spring.value, spring.direction],
          (v, dir) => dir * 0.05 + VECTOR_MULTIPLIER * v - VECTOR_TIP_LENGTH / 2
        )}
        scale={0.06}
        color={color ? color : primaryColor}
        anchorX="left"
        anchorY="middle"
        fillOpacity={spring.opacity}
        rotation-z={-rotation}
      >
        F
      </AnimatedText>
    </mesh>
  );
};

export default Vector;
