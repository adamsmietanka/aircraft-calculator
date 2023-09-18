import { animated, to, useSpring } from "@react-spring/three";
import { Cone, Cylinder } from "@react-three/drei";
import { useCSSColors } from "../../common/three/config";
import Formula from "../../common/Formula";
import AnimatedHtml from "./AnimatedHtml";

const VECTOR_MULTIPLIER = 0.2;
const VECTOR_WIDTH = 0.05;
const VECTOR_TIP_LENGTH = 0.4;

interface VectorProps {
  tex: string;
  value: number;
  rotation: number;
  show: boolean;
  color?: string;
}

const Vector = ({
  tex,
  value,
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
      size:
        10 * VECTOR_MULTIPLIER * value - Math.sign(value) * VECTOR_TIP_LENGTH,
      direction: Math.sign(value),
      opacity: show && value !== 0 ? 1 : 0,
    }),
    [value, show]
  );

  return (
    <mesh rotation-z={rotation} position-z={0.2}>
      <AnimatedCylinder
        args={[VECTOR_WIDTH, VECTOR_WIDTH, 1, 32]}
        scale-y={spring.size}
        position-y={spring.size.to((v) => v / 2)}
        material-transparent
        material-color={colors[color]}
        material-opacity={spring.opacity}
      />
      <AnimatedCone
        args={[VECTOR_TIP_LENGTH / 2.5, VECTOR_TIP_LENGTH, 32]}
        position-y={to(
          [spring.size, spring.direction],
          (v, dir) => v + (dir * VECTOR_TIP_LENGTH) / 2
        )}
        rotation-z={spring.direction.to((dir) => ((1 - dir) * Math.PI) / 2)}
        material-transparent
        material-color={colors[color]}
        material-opacity={spring.opacity}
      />
      <AnimatedHtml
        position-y={to(
          [spring.size, spring.direction],
          (v, dir) => dir * 0.05 + v
        )}
        position-x={0.5}
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
