import { animated, useSpring } from "@react-spring/three";
import { Sphere } from "@react-three/drei";
import { POINT_SIZE, useCSSColors } from "./config";

interface Props {
  position: number[];
  beforeMaxRPM: boolean;
}

const AnimatedSphere = ({ position, beforeMaxRPM }: Props) => {
  const ASphere = animated(Sphere);

  const { traceColor, infoColor, errorColor } = useCSSColors();

  const [marker] = useSpring(
    () => ({
      position,
    }),
    [position]
  );
  return (
    <ASphere
      position={marker.position}
      scale={[POINT_SIZE * 1, POINT_SIZE * 0.02, POINT_SIZE * 0.1]}
      material-color={beforeMaxRPM ? traceColor : errorColor}
    />
  );
};

export default AnimatedSphere;
