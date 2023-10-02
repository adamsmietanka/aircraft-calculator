import { Cone } from "@react-three/drei";
import { SpringValue, animated, to, useSpring } from "@react-spring/three";
import {
  VECTOR_TIP_LENGTH,
  VECTOR_TIP_WIDTH,
  useCSSColors,
} from "../three/config";
import { useMemo, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface Props {
  outside?: boolean;
  scale?: number;
  value?: number;
  opacity?: SpringValue<number>;
  distance: number;
}

const AnimatedTipNew = ({
  outside = false,
  scale,
  distance,
  value,
  opacity = new SpringValue(0),
}: Props) => {
  const AnimatedCone = animated(Cone);
  const { gridColor } = useCSSColors();

  const XOR = (a: boolean, b: boolean) => (a || b) && !(a && b);

  const meshRef = useRef<Mesh>(null!);
  const coneRef = useRef<Mesh>(null!);
  const childRef = useRef<Mesh>(null!);

  const worldScale = useMemo(() => new Vector3(1, 1, 1), []);

  useFrame(() => {
    worldScale.setFromMatrixScale(meshRef.current.matrixWorld);
    childRef.current.scale.set(
      1 / worldScale.getComponent(0),
      1 / worldScale.getComponent(1),
      1 / worldScale.getComponent(2)
    );
  });
  const fluidScale = !!scale ? scale : worldScale.x;

  const [tipSpring] = useSpring(
    () => ({
      value: value || 0,
      posY: distance / fluidScale,
    }),
    [value, fluidScale]
  );

  return (
    <animated.mesh
      ref={meshRef}
      rotation-z={XOR(outside, !!value || value === 0) ? Math.PI : 0}
      position-x={tipSpring.value}
      position-y={tipSpring.posY}
    >
      <mesh ref={childRef}>
        <AnimatedCone
          ref={coneRef}
          args={[VECTOR_TIP_WIDTH, VECTOR_TIP_LENGTH, 32]}
          // its created perfectly centered around [0,0,0]
          position-x={VECTOR_TIP_LENGTH / 2}
          material-transparent
          rotation-z={Math.PI / 2}
          material-color={gridColor}
          material-opacity={opacity}
        />
      </mesh>
    </animated.mesh>
  );
};

export default AnimatedTipNew;
