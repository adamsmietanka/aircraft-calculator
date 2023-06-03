import { ThreeElements, useFrame } from "@react-three/fiber";
import { verts } from "../../../data/verts";
import { usePropellerStore } from "../stores/usePropeller";
import { useResultsStore } from "../stores/useResults";

import * as THREE from "three";
import { useRef } from "react";
import { Html } from "@react-three/drei";
import VerticalAxis from "./VerticalAxis";

const SurfaceCp = (props: ThreeElements["mesh"]) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const points = useRef<THREE.Points>(null!);
  const positionsRef = useRef<THREE.BufferAttribute>(null);
  const surfacePositionsRef = useRef<THREE.BufferAttribute>(null);

  const blades = usePropellerStore((state) => state.blades);

  const chartType = "cp";

  const markers = useResultsStore.getState().cpMarkers;

  useFrame((state, dt) => {
    if (positionsRef.current) {
      positionsRef.current.set(markers);
      positionsRef.current.needsUpdate = true;
    }
    if (surfacePositionsRef.current) {
      surfacePositionsRef.current.set(verts[chartType][blades]);
      surfacePositionsRef.current.needsUpdate = true;
    }
  });
  const style = getComputedStyle(document.body);
  const p = style.getPropertyValue("--p").replaceAll(" ", ",")
  console.log(p);
  const traceColor = new THREE.Color(`hsl(${p})`);

  return (
    <mesh {...props} ref={mesh} scale={[0.1, 5, 1]}>
      <planeGeometry
        args={[5, 5, 50, 60]}
        onUpdate={(self) => {
          self.computeVertexNormals();
          console.log(self);
        }}
      >
        <bufferAttribute
          ref={surfacePositionsRef}
          attach="attributes-position"
          count={verts[chartType][blades].length / 3}
          array={verts[chartType][blades]}
          itemSize={3}
        />
      </planeGeometry>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            ref={positionsRef}
            attach="attributes-position"
            count={markers.length / 3}
            array={markers}
            itemSize={3}
            // usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <pointsMaterial
          attach="material"
          color={traceColor}
          size={5}
          sizeAttenuation={false}
        />
      </points>

      <meshStandardMaterial
        color="lightgreen"
        side={THREE.DoubleSide}
        opacity={0.6}
        transparent
        wireframe
      />
      <VerticalAxis/>
    </mesh>
  );
};

export default SurfaceCp;
