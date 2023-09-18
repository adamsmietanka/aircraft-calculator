import { animated, useSpring } from "@react-spring/three";
import { Cone, Cylinder } from "@react-three/drei";
import { useCSSColors } from "../../common/three/config";
import Formula from "../../common/Formula";
import AnimatedHtml from "../../common/three/AnimatedHtml";

const VECTOR_WIDTH = 0.05;
const VECTOR_TIP_LENGTH = 0.4;
const VECTOR_SIZE = 2.5 - VECTOR_TIP_LENGTH;

interface VectorProps {
  tex: string;
  value: number;
  otherValue?: number;
  rotation: number;
  show: boolean;
  color?: string;
}

const Vector = ({
  tex,
  value,
  otherValue = 0,
  rotation,
  show,
  color = "primary",
}: VectorProps) => {
  const AnimatedCylinder = animated(Cylinder);
  const AnimatedCone = animated(Cone);

  const { colors } = useCSSColors();

  const [spring] = useSpring(
    () => ({
      value,
      textY:
        value * (VECTOR_SIZE + VECTOR_TIP_LENGTH) +
        (otherValue ? 0.1 : 0.5) * Math.sign(value),
      otherDirection: otherValue ? Math.sign(otherValue) : 0,
      opacity: show && value !== 0 ? 1 : 0,
    }),
    [value, otherValue, show]
  );

  return (
    <mesh rotation-z={rotation} position-z={0.2}>
      <animated.mesh
        scale-x={spring.value.to((v) => Math.sqrt(Math.abs(v)))}
        scale-y={spring.value}
      >
        <AnimatedCylinder
          args={[VECTOR_WIDTH, VECTOR_WIDTH, 1, 32]}
          scale-y={VECTOR_SIZE}
          position-y={VECTOR_SIZE / 2}
          material-transparent
          material-color={colors[color]}
          material-opacity={spring.opacity}
        />
        <AnimatedCone
          args={[VECTOR_TIP_LENGTH / 2, VECTOR_TIP_LENGTH, 32]}
          position-y={VECTOR_SIZE + VECTOR_TIP_LENGTH / 2}
          material-transparent
          material-color={colors[color]}
          material-opacity={spring.opacity}
        />
      </animated.mesh>
      <AnimatedHtml
        position-x={spring.otherDirection.to((dir) => -0.8 * dir)}
        position-y={spring.textY}
        rotation-z={-rotation}
        show={show}
      >
        <div className={`text-${color} text-xl`}>
          <Formula tex={tex} />
        </div>
      </AnimatedHtml>
    </mesh>
  );
};

export default Vector;
