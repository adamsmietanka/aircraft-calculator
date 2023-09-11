import { SpringValue, animated, config, useSpring } from "@react-spring/three";
import React, { useMemo, useRef } from "react";
import { DoubleSide } from "three";
import useProfile from "../hooks/useProfile";
import { useFrame } from "@react-three/fiber";
import { useWingStore } from "../stores/useWing";
import { getXTip } from "./hooks/useWingSprings";
import { useLocation } from "react-router-dom";
const PANELS = 101;

interface Props {
  opacity: SpringValue<number>;
}

const SceneFuselage = () => {
  const wing = useWingStore();
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const { profilePoints } = useProfile();
  const pointsEnd = profilePoints.map(([x, y, z]) => [x, y, 5]);

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

  const position = useMemo(() => {
    return new Float32Array(6 * 3 * PANELS);
  }, []);

  const location = useLocation();

  const [s] = useSpring(
    () => ({
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
      config: config.slow,
    }),
    []
  );

  useFrame(() => {
    console.log(s.opacity.get());
    if (positionRef.current) {
      let arr = [];
      for (let i = 0; i < PANELS; i++) {
        // arr.push(...profilePoints[i]);
        arr.push(...pointsFuse[i]);
        arr.push(...pointsFuse[i + 1]);
        arr.push(...pointsTip[i]);
        arr.push(...pointsFuse[i + 1]);
        arr.push(...pointsTip[i + 1]);
        arr.push(...pointsTip[i]);
      }
      //   console.log(arr, pointsFuse);
      positionRef.current.set(arr);
      positionRef.current.needsUpdate = true;
    }
  });

  return (
    <animated.mesh position-x={0}>
      <bufferGeometry
        onUpdate={(self) => {
          self.computeVertexNormals();
        }}
        onHover={(self) => {
          self.computeVertexNormals();
        }}
      >
        <bufferAttribute
          ref={positionRef}
          attach="attributes-position"
          count={position.length / 3}
          array={position}
          itemSize={3}
        />
      </bufferGeometry>
      <animated.meshStandardMaterial
        color={"gray"}
        side={DoubleSide}
        metalness={0.5}
        opacity={s.opacity}
        transparent
      />
    </animated.mesh>
  );
};

export default SceneFuselage;
