import { SpringRef, animated, useSpring } from "@react-spring/three";
import { Sphere } from "@react-three/drei";

interface Props {
  position: number[];
  scale: number[];
  color: string;
  springRef?: SpringRef;
}

const AnimatedSphere = ({ position, color, scale, springRef }: Props) => {
  const ASphere = animated(Sphere);

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
      scale={scale}
      material-color={color}
      material-transparent
      material-opacity={test.opacity}
    />
  );
};

export default AnimatedSphere;
