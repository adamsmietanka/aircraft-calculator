import { DoubleSide } from "three";
import { PresentationControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useWingModel from "./hooks/useWingModel";

const Fuselage = () => {
  const { geometry, tipGeometry } = useWingModel();

  const { nodes } = useLoader(GLTFLoader, "/models/2303.glb");

  return (
    <mesh position-x={-4}>
      <PresentationControls
        enabled={true} // the controls can be disabled by setting this to false
        global={false} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={false} // Snap-back to center (can also be a spring config)
        speed={1} // Speed factor
        zoom={2} // Zoom factor when half the polar-max is reached
        rotation={[0, 0, 0]} // Default rotation
        polar={[-Math.PI / 8, Math.PI / 16]} // Vertical limits
        azimuth={[-Math.PI / 2, Math.PI / 2]} // Horizontal limits
        config={{ mass: 1, tension: 170, friction: 26 }}
      >
        <spotLight position={[-5, 5, 10]} intensity={0.5} />

        <mesh
          geometry={nodes.fuselage?.geometry}
          rotation-x={Math.PI / 2}
          rotation-z={-Math.PI / 2}
          scale={0.1 * 6}
          position-x={-1}
        >
          <meshStandardMaterial
            color={"lightgray"}
            side={DoubleSide}
            metalness={1}
          />
        </mesh>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color={"lightgray"}
            side={DoubleSide}
            metalness={1}
          />
        </mesh>
        <mesh geometry={geometry} scale-z={-1}>
          <meshStandardMaterial
            color={"lightgray"}
            side={DoubleSide}
            metalness={1}
          />
        </mesh>
        <mesh geometry={tipGeometry}>
          <meshStandardMaterial
            color={"lightgray"}
            side={DoubleSide}
            metalness={1}
          />
        </mesh>
      </PresentationControls>
    </mesh>
  );
};

export default Fuselage;
