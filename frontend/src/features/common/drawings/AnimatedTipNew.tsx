import { Cone } from "@react-three/drei";
import { SpringValue, animated, to, useSpring } from "@react-spring/three";
import {
  VECTOR_TIP_LENGTH,
  VECTOR_TIP_WIDTH,
  useCSSColors,
} from "../three/config";

interface Props {
  end?: boolean;
  outside?: boolean;
  scale: number;
  value?: number;
  opacity?: SpringValue<number>;
  distance: number;
}

const AnimatedTipNew = ({
  end = false,
  outside = false,
  scale,
  distance,
  value,
  opacity = new SpringValue(0),
}: Props) => {
  const AnimatedCone = animated(Cone);
  const { gridColor } = useCSSColors();
  const [tipSpring] = useSpring(
    () => ({
      value: (value || 0) * scale,
    }),
    [value, scale]
  );

  const XOR = (a: boolean, b: boolean) => (a || b) && !(a && b);

  return (
    <animated.mesh
      rotation-z={XOR(outside, !!value || value === 0) ? Math.PI : 0}
      position-x={tipSpring.value}
      position-y={distance}
    >
      <AnimatedCone
        args={[VECTOR_TIP_WIDTH, VECTOR_TIP_LENGTH, 32]}
        // its created perfectly centered around [0,0,0]
        position-x={VECTOR_TIP_LENGTH / 2}
        material-transparent
        rotation-z={Math.PI / 2}
        material-color={gridColor}
        material-opacity={opacity}
      />
    </animated.mesh>
  );
};

export default AnimatedTipNew;
