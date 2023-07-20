import { SpringRef, animated, useSpring } from "@react-spring/three";
import { Sphere } from "@react-three/drei";
import { POINT_SIZE, useCSSColors } from "./config";

interface Props {
  position: number[];
  scale?: number[];
  beforeMaxRPM?: boolean;
  color: string;
  springRef?: SpringRef;

}

const AnimatedSphere = ({ position, color, scale, springRef }: Props) => {
  const ASphere = animated(Sphere);

  const { traceColor, infoColor, errorColor } = useCSSColors();

  const test = useSpring({
    ref: springRef,
    from: { opacity: 0 },
    to: { opacity: 1 },
    // config: config.slow,
  });

  const [marker] = useSpring(
    () => ({
      position,
    }),
    [position]
  );
  return (
    <ASphere
      position={marker.position}
      scale={
        scale ? scale : [POINT_SIZE * 1, POINT_SIZE * 0.02, POINT_SIZE * 0.1]
      }
      material-color={color}
      material-transparent
      material-opacity={test.opacity}
    />
  );
};

export default AnimatedSphere;
