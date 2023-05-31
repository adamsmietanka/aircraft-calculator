import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import * as THREE from "three";
import SurfaceCp from "./SurfaceCp";
import SurfaceEff from "./SurfaceEff";

const Lights = () => {
  const pointLightRef = useRef(null!);
  useHelper(pointLightRef, THREE.PointLightHelper, 1);
  return (
    <>
      <pointLight ref={pointLightRef} position={[-10, 10, 10]} />
    </>
  );
};

const PowerUnitResults3D = () => {
  return (
    <div className="h-96 w-full">
      <Canvas orthographic camera={{ zoom: 40, position: [-10, 10, 15] }}>
        <axesHelper />
        <ambientLight intensity={0.4} />
        <Lights />
        <SurfaceCp />
        <SurfaceEff position={[0, 0, 6.5]} />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.25}
          target={[3.5, 1, 5.5]}
        />
        {/* <Stats /> */}
      </Canvas>
    </div>
  );
};

export default PowerUnitResults3D;
