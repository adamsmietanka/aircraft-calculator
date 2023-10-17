import { DoubleSide } from "three";
import { PresentationControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useWingModel from "./hooks/useWingModel";
import { SpringValue, animated, useSpring } from "@react-spring/three";
import Inputs3D from "../../common/three/Inputs3D";
import FuselageConfiguration from "../FuselageConfiguration";
import { usePlaneStore } from "../stores/usePlane";
import { useWingStore } from "../stores/useWing";

interface Props {
  opacity: SpringValue<number>;
}

const WingModel = ({ opacity }: Props) => {
  const { geometry, tipGeometry } = useWingModel();

  return (
    <>
      <mesh geometry={geometry}>
        <animated.meshStandardMaterial
          color={"lightgray"}
          side={DoubleSide}
          metalness={1}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh geometry={tipGeometry}>
        <animated.meshStandardMaterial
          color={"lightgray"}
          side={DoubleSide}
          metalness={1}
          transparent
          opacity={opacity}
        />
      </mesh>
    </>
  );
};

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
        color={"lightgray"}
        side={DoubleSide}
        metalness={1}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
};

const Fuselage = ({ opacity }: Props) => {
  const configuration = usePlaneStore((state) => state.configuration);
  const span = useWingStore((state) => state.span);

  const [planeSpring] = useSpring(
    () => ({
      wingY: configuration === 1 || configuration === 3 ? 1 : 0,
      fuseZ: configuration === 2 || configuration === 3 ? span / 6 : 0,
    }),
    [configuration]
  );

  return (
    <mesh position-x={-4.5}>
      <mesh rotation={[(-20 * Math.PI) / 180, (-45 * Math.PI) / 180, 0, "YXZ"]}>
        <Inputs3D gridPositionX={-0.8}>
          <FuselageConfiguration />
        </Inputs3D>
      </mesh>
      <spotLight position={[-10, 5, 10]} intensity={0.5} />
      <PresentationControls
        enabled={true} // the controls can be disabled by setting this to false
        global={false} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={true} // Snap-back to center (can also be a spring config)
        speed={1} // Speed factor
        zoom={2} // Zoom factor when half the polar-max is reached
        rotation={[0, 0, 0]} // Default rotation
        polar={[-Math.PI / 8, Math.PI / 16]} // Vertical limits
        azimuth={[-Math.PI / 2, Math.PI / 2]} // Horizontal limits
        config={{ mass: 1, tension: 170, friction: 26 }}
      >
        <mesh scale={1.25}>
          <animated.mesh position-z={planeSpring.fuseZ.to((z) => -z)}>
            <FuseModel opacity={opacity} />
          </animated.mesh>
          <animated.mesh position-z={planeSpring.fuseZ}>
            <FuseModel opacity={opacity} />
          </animated.mesh>
          <WingModel opacity={opacity} />
          <animated.mesh position-y={planeSpring.wingY}>
            <WingModel opacity={opacity} />
          </animated.mesh>
        </mesh>
      </PresentationControls>
    </mesh>
  );
};

export default Fuselage;
