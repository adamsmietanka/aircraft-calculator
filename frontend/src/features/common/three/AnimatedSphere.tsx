import { SpringRef, animated, useSpring } from "@react-spring/three";
import { Sphere } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";

interface Props {
  position: number[];
  scale: number[];
  color: string;
  springRef?: SpringRef;
  onClick?: ((event: ThreeEvent<MouseEvent>) => void) | undefined;
}

const AnimatedSphere = ({
  position,
  color,
  scale,
  springRef,
  onClick,
}: Props) => {
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
      onClick={onClick}
      position={marker.position}
      scale={scale}
      material-color={color}
      material-transparent
      material-opacity={test.opacity}
    />
  );
};

export default AnimatedSphere;
