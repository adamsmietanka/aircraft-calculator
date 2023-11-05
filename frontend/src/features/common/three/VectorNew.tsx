import { SpringValue, animated, to, useSpring } from "@react-spring/three";
import { Cone, Cylinder } from "@react-three/drei";
import { useCSSColors } from "../../common/three/config";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import { ReactNode, useEffect } from "react";

const VECTOR_WIDTH = 0.05;
const VECTOR_TIP_LENGTH = 0.5;
const VECTOR_SIZE = 3.5;

interface VectorProps {
  x?: number;
  y?: number;
  z?: number;
  otherValue?: number;
  show: boolean;
  color?: string;
  opacity: SpringValue<number>;
  children?: ReactNode;
}

const VectorNew = ({
  x = 0,
  y = 0,
  z = 0,
  otherValue = 0,
  show,
  color = "primary",
  opacity,
  children,
}: VectorProps) => {
  const AnimatedCylinder = animated(Cylinder);
  const AnimatedCone = animated(Cone);

  const { colors } = useCSSColors();

  const length = Math.sqrt(x * x + y * y + z * z);

  const [spring, springApi] = useSpring(
    () => ({
      value: length,
      rotationZ: Math.atan(y / x) + (x < 0 ? Math.PI : 0),
      textY:
        length * VECTOR_SIZE + (otherValue ? 0.1 : 0.5) * (length < 0 ? -1 : 1),
      otherDirection: otherValue ? Math.sign(otherValue) : 0,
      opacity: show && length !== 0 ? 1 : 0,
      rotation: 0,
      visible: show,
    }),
    [otherValue, x, y, z, length]
  );

  useEffect(() => {
    springApi.start({
      to: async (next) => {
        show && (await next({ visible: true }));
        await next({ opacity: show && length !== 0 ? 1 : 0 });
        show || (await next({ visible: false }));
      },
    });
  }, [show, length]);

  return (
    <animated.mesh
      rotation-z={spring.rotationZ}
      position-z={0}
      visible={spring.visible}
    >
      <mesh rotation-z={-Math.PI / 2}>
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
          rotation-z={spring.rotationZ.to((r) => -r + Math.PI / 2)}
          show={show && length !== 0}
        >
          <div className={`text-${color} text-xl`}>{children}</div>
        </AnimatedHtml>
      </mesh>
    </animated.mesh>
  );
};

export default VectorNew;
