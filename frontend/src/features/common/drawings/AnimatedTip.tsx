import { Cone } from "@react-three/drei";
import { SpringValue, animated, to } from "@react-spring/three";
import {
  MEASUREMENT_DISTANCE,
  VECTOR_TIP_LENGTH,
  VECTOR_TIP_WIDTH,
  useCSSColors,
} from "../three/config";
import { FluidNumber } from "../types/three";

interface Props {
  end?: boolean;
  scale: FluidNumber;
  value?: FluidNumber;
  opacity?: FluidNumber;
  distance?: FluidNumber;
}

const AnimatedTip = ({
  end = false,
  scale,
  distance,
  value = new SpringValue(0),
  opacity = new SpringValue(0),
}: Props) => {
  const AnimatedCone = animated(Cone);
  const { gridColor } = useCSSColors();

  return (
    <animated.mesh
      rotation-z={end ? Math.PI : 0}
      position-x={value}
      position-y={
        distance ? distance : to(scale, (scale) => MEASUREMENT_DISTANCE / scale)
      }
    >
      <AnimatedCone
        args={[VECTOR_TIP_WIDTH, VECTOR_TIP_LENGTH, 32]}
        // its created perfectly centered around local [0,0,0]
        position-x={to(scale, (scale) => VECTOR_TIP_LENGTH / (2 * scale))}
        scale={to(scale, (s) => 1 / s)}
        material-transparent
        rotation-z={Math.PI / 2}
        material-color={gridColor}
        material-opacity={opacity}
      />
    </animated.mesh>
  );
};

export default AnimatedTip;
