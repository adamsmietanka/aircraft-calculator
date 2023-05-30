import React, { useEffect, useRef } from 'react'
import { ThreeElements, useFrame } from '@react-three/fiber';
import { usePropellerStore } from '../stores/usePropeller';
import { useResultsStore } from '../stores/useResults';
import { verts } from '../../../data/verts';

import * as THREE from "three";
import { Html } from '@react-three/drei';

const SurfaceEff = (props: ThreeElements["mesh"]) => {
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
      <mesh {...props} ref={mesh} scale={[0.1, 6, 1]}>
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
          position={[60, 0.4, 0]}
          center
        >
          Eff
        </Html>
      </mesh>
    );
  };

export default SurfaceEff