import { SpringValue, animated, to, useSpring } from "@react-spring/three";
import { Cone, Cylinder, Torus } from "@react-three/drei";
import { useCSSColors } from "../../common/three/config";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import { ReactNode, useEffect } from "react";

const VECTOR_WIDTH = 0.05;
const VECTOR_TIP_LENGTH = 0.5;
const VECTOR_SIZE = 3.5;
const MOMENT_RADIUS = 0.4;

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

const MomentNew = ({
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
  const AnimatedTorus = animated(Torus);
  const AnimatedCone = animated(Cone);

  const { colors } = useCSSColors();

  const length = Math.sqrt(x * x + y * y + z * z);

  const [spring, springApi] = useSpring(
    () => ({
      value: length,
      rotationZ: Math.atan2(y, x),
      otherDirection: otherValue ? Math.sign(otherValue) : 0,
      opacity: +show,
      rotation: 0,
      visible: show,
    }),
    [otherValue, x, y, z]
  );

  useEffect(() => {
    springApi.start({
      to: async (next) => {
        show && (await next({ visible: true }));
        await next({ opacity: +show });
        show || (await next({ visible: false }));
      },
    });
  }, [show]);

  return (
    <animated.mesh position-z={0} scale-x={-1} visible={spring.visible}>
      <mesh rotation-z={-Math.PI / 2}>
        <AnimatedTorus
          args={[0.4, 0.03, 12, 48, Math.PI * 1.25]}
          material-transparent
          material-color={colors[color]}
          material-opacity={to(
            [spring.opacity, opacity],
            (opacity, stepOpacity) => opacity * stepOpacity
          )}
        />
        <animated.mesh
          //   scale={spring.value.to((v) => Math.sign(v) * Math.sqrt(Math.abs(v)))}
          rotation-z={Math.PI * 1.25}
        >
          <mesh position-x={0.4} scale={0.6}>
            <AnimatedCone
              args={[VECTOR_TIP_LENGTH / 2.5, VECTOR_TIP_LENGTH, 32]}
              position-y={VECTOR_TIP_LENGTH / 2}
              material-transparent
              material-color={colors[color]}
              material-opacity={to(
                [spring.opacity, opacity],
                (opacity, stepOpacity) => opacity * stepOpacity
              )}
            />
          </mesh>
        </animated.mesh>
      </mesh>
      <AnimatedHtml
        position-x={-0.75}
        scale-x={-1}
        position-y={0.75}
        show={show}
      >
        <div className={`text-${color} text-xl`}>{children}</div>
      </AnimatedHtml>
    </animated.mesh>
  );
};

export default MomentNew;
