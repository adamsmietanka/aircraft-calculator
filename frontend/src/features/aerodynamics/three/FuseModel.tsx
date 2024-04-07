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
  const length = usePlaneStore((state) => state.length);
  const wingX = usePlaneStore((state) => state.wingX);
  const fuseLatch = usePlaneStore((state) => state.fuseLatch);

  const first = useRef<Mesh>(null!);
  const second = useRef<Mesh>(null!);

  const [spring] = useSpring(
    () => ({
      scaleFirst: fuseLatch ? length : length / 2,
      posFirst: fuseLatch ? -wingX : 0,
      scaleSecond: fuseLatch ? length / 2 : length,
      posSecond: fuseLatch ? 0 : -wingX,
      wingPosition: -wingX,
    }),
    [fuselage, fuseLatch, length, wingX]
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
        position-x={spring.posFirst}
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
        position-x={spring.posSecond}
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
