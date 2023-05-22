import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Stats, OrbitControls, useHelper } from "@react-three/drei";
import { clark_2 } from "../../data/cp";
import {
  generate_verts_rev,
  rotate_mesh,
} from "../../utils/three/meshGeneration";
import { useResultsStore } from "./stores/useResults";
import InputAltitude from "../common/InputAltitude";
import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";

const Surface = (props: ThreeElements["mesh"]) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // useFrame((state, delta) => (mesh.current.rotation.y += 0.5*delta));

  // const positions = new Float32Array([-10, 0, 0, 10, 0, 0]);

  const positions = new Float32Array([
    19.67, 0.0642, 0, 19.81, 0.0642, 0.1197, 20.04, 0.0642, 0.2394, 20.43,
    0.0642, 0.3591, 21, 0.0642, 0.4788, 21.79, 0.0642, 0.5985, 22.89, 0.0642,
    0.7182, 24.23, 0.0642, 0.8379, 25.73, 0.0642, 0.9576, 27.15, 0.0642, 1.077,
    28.93, 0.0642, 1.197, 30.89, 0.0642, 1.317, 32.85, 0.0642, 1.436, 34.55,
    0.0642, 1.556, 36.1, 0.0642, 1.676, 37.51, 0.0642, 1.796, 38.83, 0.0642,
    1.915, 40.03, 0.0642, 2.035,
  ]);
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[0.1, 10, 1]}
      onClick={(event) => {
        console.log(mesh);
        console.log(generate_verts_rev(rotate_mesh(clark_2.mesh)));
        // mesh.current.geometry.computeVertexNormals();
      }}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <planeGeometry
        args={[5, 5, 50, 60]}
        onUpdate={(self) => {
          self.computeVertexNormals();
          console.log(self);
        }}
      >
        <bufferAttribute
          attach="attributes-position"
          count={clark_2.verts.length / 3}
          array={clark_2.verts}
          itemSize={3}
        />
      </planeGeometry>
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
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
        color={hovered ? "hotpink" : "orange"}
        side={THREE.DoubleSide}
        opacity={0.6}
        transparent
      />
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

const PowerUnitResults = () => {
  const altitude = useResultsStore((state) => state.altitude);
  const setAltitude = useResultsStore((state) => state.setAltitude);
  
  return (
    <div className="flex w-full p-4">
      <div className="flex flex-col w-80 mr-8 space-y-2">
        <InputAltitude value={altitude} setter={setAltitude} label="Altitude" />
        <div className="card card-compact w-80 shadow-xl">
          <div className="card-body">
            <PowerUnitPropellerBlades />
            <PowerUnitPropellerPitch />
          </div>
        </div>
      </div>
      <div className="h-96 w-96">
        <Canvas>
          <axesHelper />
          <ambientLight intensity={0.4} />
          <Lights />
          <Surface position={[0, 0, 0]} />
          <OrbitControls />
          {/* <Stats /> */}
        </Canvas>
      </div>
    </div>
  );
};

export default PowerUnitResults;
