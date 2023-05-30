import { ThreeElements, useFrame } from "@react-three/fiber";
import { verts } from "../../../data/verts";
import { usePropellerStore } from "../stores/usePropeller";
import { useResultsStore } from "../stores/useResults";

import * as THREE from "three";
import { useRef } from "react";
import { Html } from "@react-three/drei";

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
  return (
    <mesh {...props} ref={mesh} scale={[0.1, 6, 1]}>
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
          color={"blue"}
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
      <Html
        className="select-none"
        color="black"
        scale={[10, 0.1, 1]}
        up={[0, -10, 0]}
        position={[35, 0, 0]}
        center
      >
        Angle
      </Html>
      <Html
        className="select-none"
        color="black"
        scale={[10, 0.1, 1]}
        position={[60, 0.2, 0]}
        center
      >
        Cp
      </Html>
      <Html
        className="select-none"
        color="black"
        scale={[10, 0.1, 1]}
        position={[8, 0, 2.5]}
        center
      >
        J
      </Html>
    </mesh>
  );
};

export default SurfaceCp;
