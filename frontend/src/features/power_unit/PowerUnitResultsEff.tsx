import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, ThreeElements, useThree } from "@react-three/fiber";
import { Stats, OrbitControls, useHelper, Html } from "@react-three/drei";
import { usePropellerStore } from "./stores/usePropeller";
import * as THREE from "three";
import { verts } from "../../data/verts";
import { useResultsStore } from "./stores/useResults";


const Surface = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  const points = useRef<THREE.Points>(null!);
  const positionsRef = useRef<THREE.BufferAttribute>(null);
  const surfacePositionsRef = useRef<THREE.BufferAttribute>(null);

  const blades = usePropellerStore((state) => state.blades);

  const chartType = "eff";
  
  const markers = useResultsStore.getState().effMarkers;


  useFrame((state, dt) => {
    // console.log(state)
    if (positionsRef.current) {
      positionsRef.current.set(markers);
      positionsRef.current.needsUpdate = true;
    }
    if (surfacePositionsRef.current) {
      surfacePositionsRef.current.set(verts[chartType][blades]);
      surfacePositionsRef.current.needsUpdate = true;
    }
  });

  useEffect(() => {
    if (mesh.current) {
      mesh.current.geometry.computeVertexNormals();
    }
  }, [blades])

  return (
    <mesh ref={mesh} scale={[0.1, 6, 1]}>
      <planeGeometry
        args={[5, 5, 100, 110]}
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
        position={[60, 0.4, 0]}
        center
      >
        Eff
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

const PowerUnitResultsEff = () => {
  return (
    <div className="h-96 w-96">
      <Canvas orthographic camera={{ zoom: 50, position: [-10, 1, 10] }} >
        <axesHelper />
        <ambientLight intensity={0.4} />
        <Lights />
        <Surface />
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

export default PowerUnitResultsEff;
