import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Stats, OrbitControls, useHelper, Html } from "@react-three/drei";
import { usePropellerStore } from "./stores/usePropeller";
import * as THREE from "three";
import { verts } from "../../data/verts";
import { useResultsStore } from "./stores/useResults";

interface SurfaceProps {
  cpMarkers: Float32Array;
}

const Surface = ({ cpMarkers }: SurfaceProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const points = useRef<THREE.Points>(null!);
  const positionsRef = useRef<THREE.BufferAttribute>(null);
  const surfacePositionsRef = useRef<THREE.BufferAttribute>(null);

  const blades = usePropellerStore((state) => state.blades);

  const chartType = "cp";

  const center = useMemo(() => {
    if (mesh.current) {
      mesh.current.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      mesh.current.geometry.boundingBox?.getCenter(center);
      return center;
    }
  }, []);

  useFrame((state, dt) => {
    if (positionsRef.current) {
      positionsRef.current.set(cpMarkers);
      positionsRef.current.needsUpdate = true;
    }
    if (surfacePositionsRef.current) {
      surfacePositionsRef.current.set(verts[chartType][blades]);
      surfacePositionsRef.current.needsUpdate = true;
    }
  });
  return (
    <mesh ref={mesh} scale={[0.1, 6, 1]}>
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
            count={cpMarkers.length / 3}
            array={cpMarkers}
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

const Lights = () => {
  const pointLightRef = useRef(null!);
  useHelper(pointLightRef, THREE.PointLightHelper, 100);
  return (
    <>
      <pointLight ref={pointLightRef} position={[10, 10, 10]} />
    </>
  );
};

const PowerUnitResultsCp = () => {
  const cpMarkers = useResultsStore.getState().cpMarkers;
  return (
    <div className="h-96 w-96">
      <Canvas>
        <axesHelper />
        <ambientLight intensity={0.4} />
        <Lights />
        <Surface cpMarkers={cpMarkers} />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.25}
          target={[3.5, 1, 2.5]}
        />
        {/* <Stats /> */}
      </Canvas>
    </div>
  );
};

export default PowerUnitResultsCp;
