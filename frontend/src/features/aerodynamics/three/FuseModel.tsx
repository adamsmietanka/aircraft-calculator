import { SpringValue, animated, useSpring } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { usePlaneStore } from "../stores/usePlane";
import { useEffect, useRef } from "react";
import { Mesh } from "three";

interface Props {
  opacity: SpringValue<number>;
}

const FuseModel = ({ opacity }: Props) => {
  const { nodes } = useLoader(GLTFLoader, "/models/fuse.glb");
  const fuselage = usePlaneStore((state) => state.fuselage);
  const fuseLatch = usePlaneStore((state) => state.fuseLatch);

  const first = useRef<Mesh>(null!);
  const second = useRef<Mesh>(null!);

  const [spring] = useSpring(
    () => ({
      scaleFirst: fuseLatch ? 8 : 1,
      scaleSecond: fuseLatch ? 1 : 8,
    }),
    [fuselage, fuseLatch]
  );

  const setFuselages = () => {
    if (fuseLatch) first.current.geometry = nodes[fuselage]?.geometry;
    else second.current.geometry = nodes[fuselage]?.geometry;
  };

  useEffect(() => {
    setFuselages();
  }, [fuseLatch]);

  useEffect(() => {
    setFuselages();
  }, []);

  return (
    <>
      <animated.mesh
        ref={first}
        geometry={nodes[2302]?.geometry}
        scale={spring.scaleFirst}
        position-x={-1.5}
      >
        <animated.meshStandardMaterial
          color={"white"}
          metalness={0.5}
          transparent
          opacity={opacity}
        />
      </animated.mesh>
      <animated.mesh
        ref={second}
        geometry={nodes[2304]?.geometry}
        scale={spring.scaleSecond}
        position-x={-1.5}
      >
        <animated.meshStandardMaterial
          color={"white"}
          metalness={0.5}
          transparent
          opacity={opacity}
        />
      </animated.mesh>
    </>
  );
};

export default FuseModel;
