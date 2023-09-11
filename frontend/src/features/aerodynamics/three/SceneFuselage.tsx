import { SpringValue, animated, config, useSpring } from "@react-spring/three";
import { useMemo } from "react";
import { BufferAttribute, BufferGeometry, DoubleSide } from "three";
import useProfile from "../hooks/useProfile";
import { useWingStore } from "../stores/useWing";
import { getXTip } from "./hooks/useWingSprings";
import { PresentationControls } from "@react-three/drei";
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

  return (
    <PresentationControls
      enabled={true} // the controls can be disabled by setting this to false
      global={true} // Spin globally or by dragging the model
      cursor={true} // Whether to toggle cursor style on drag
      snap={true} // Snap-back to center (can also be a spring config)
      speed={1} // Speed factor
      zoom={1.5} // Zoom factor when half the polar-max is reached
      rotation={[0, 0, 0]} // Default rotation
      polar={[-Math.PI / 16, Math.PI / 16]} // Vertical limits
      azimuth={[-Math.PI / 2, Math.PI / 8]} // Horizontal limits
      config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
      // domElement={events.connected} // The DOM element events for this controller will attach to
    >
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
