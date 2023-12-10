import { SpringValue, animated } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface Props {
  opacity: SpringValue<number>;
}

const FuseModel = ({ opacity }: Props) => {
  const { nodes } = useLoader(GLTFLoader, "/models/2303.glb");

  return (
    <mesh
      geometry={nodes.fuselage?.geometry}
      rotation-x={Math.PI / 2}
      rotation-z={-Math.PI / 2}
      scale={0.1 * 6}
      position-x={-1}
    >
      <animated.meshStandardMaterial
        color={"white"}
        // side={DoubleSide}
        metalness={0.5}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
};

export default FuseModel;
