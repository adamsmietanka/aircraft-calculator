import { SpringValue, animated, config, useSpring } from "@react-spring/three";
import { useMemo } from "react";
import { BufferAttribute, BufferGeometry, DoubleSide } from "three";
import useProfile from "../hooks/useProfile";
import { useWingStore } from "../stores/useWing";
import { getXTip } from "./hooks/useWingSprings";
import {
  Gltf,
  MeshTransmissionMaterial,
  PresentationControls,
} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const PANELS = 101;

interface Props {
  opacity: SpringValue<number>;
}

const SceneFuselage = () => {
  const wing = useWingStore();

  const { profilePoints } = useProfile();

  const pointsFuse = profilePoints.map(([x, y, z]) => [
    wing.chord * x,
    wing.chord * y,
    0,
  ]);

  const xTip = getXTip(wing.angle, wing.span);

  const pointsTip = profilePoints.map(([x, y, z]) => [
    xTip + wing.chordTip * x,
    wing.chordTip * y,
    wing.span / 2,
  ]);

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

  const geometry = useMemo(() => {
    const geom = new BufferGeometry();
    if (profilePoints.length) {
      let arr = [];
      for (let i = 0; i < PANELS; i++) {
        arr.push(...pointsFuse[i]);
        arr.push(...pointsFuse[i + 1]);
        arr.push(...pointsTip[i]);
        arr.push(...pointsFuse[i + 1]);
        arr.push(...pointsTip[i + 1]);
        arr.push(...pointsTip[i]);
      }
      const attr = new BufferAttribute(new Float32Array(arr), 3);
      geom.setAttribute("position", attr);
      geom.computeVertexNormals();
      return geom;
    }
  }, [profilePoints]);

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
