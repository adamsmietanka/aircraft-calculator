import { animated, config, useSpring } from "@react-spring/three";
import { DoubleSide } from "three";
import {
  Gltf,
  MeshTransmissionMaterial,
  PresentationControls,
} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useWingModel from "./hooks/useWingModel";

const SceneFuselage = () => {
  const [s] = useSpring(
    () => ({
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
      config: config.molasses,
    }),
    []
  );

  const { geometry } = useWingModel();

  const { nodes } = useLoader(GLTFLoader, "/models/2303.glb");

  return (
    <PresentationControls
      enabled={true} // the controls can be disabled by setting this to false
      global={true} // Spin globally or by dragging the model
      cursor={true} // Whether to toggle cursor style on drag
      snap={true} // Snap-back to center (can also be a spring config)
      speed={1} // Speed factor
      zoom={2} // Zoom factor when half the polar-max is reached
      rotation={[0, 0, 0]} // Default rotation
      polar={[-Math.PI / 8, Math.PI / 16]} // Vertical limits
      azimuth={[-Math.PI / 2, Math.PI / 8]} // Horizontal limits
      config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
      // domElement={events.connected} // The DOM element events for this controller will attach to
    >
      <spotLight position={[-5, 5, 5]} intensity={0.25} />
      {/* <primitive object={gltf.scene}>
        <meshBasicMaterial wireframe />
      </primitive> */}
      {/* <Gltf src="/models/2303.glb" receiveShadow castShadow /> */}
      <mesh
        geometry={nodes.fuselage.geometry}
        rotation-x={Math.PI / 2}
        rotation-z={-Math.PI / 2}
        scale={0.1 * 6}
        position-x={-1}
      >
        {/* <MeshTransmissionMaterial
          transmissionSampler
          transmission={0.9}
          attenuationColor="#ffffff"
          color="gray"
        /> */}

        {/* <meshBasicMaterial /> */}
        <animated.meshStandardMaterial
          color={"gray"}
          side={DoubleSide}
          metalness={0.5}
          opacity={s.opacity}
          transparent
        />
      </mesh>
      <mesh position-x={0} geometry={geometry}>
        <animated.meshStandardMaterial
          color={"gray"}
          side={DoubleSide}
          metalness={0.5}
          opacity={s.opacity}
          transparent
        />
      </mesh>
      <mesh position-x={0} geometry={geometry} scale-z={-1}>
        <animated.meshStandardMaterial
          color={"gray"}
          side={DoubleSide}
          metalness={0.5}
          opacity={s.opacity}
          transparent
        />
      </mesh>
    </PresentationControls>
  );
};

export default SceneFuselage;
