import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import * as THREE from "three";
import SurfaceCp from "./SurfaceCp";
import SurfaceEff from "./SurfaceEff";
import GridLines from "./GridLines";

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
  // const style = getComputedStyle(document.body);
  // const b1 = style.getPropertyValue("--b1").replaceAll(" ", ",");
  // console.log(b1);
  // const bgColor = new THREE.Color(`hsl(${b1})`);
  return (
    <div className="h-96 w-full">
      <Canvas orthographic camera={{ zoom: 30, position: [-10, 10, 15] }}>
        <ambientLight intensity={0.4} />
        <Lights />
        <SurfaceCp position={[-1, 0, 0]} />
        <SurfaceEff position={[-1, 0, 10]} />
        <GridLines />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.25}
          target={[2.5, 1, 7.5]}
        />
        {/* <Stats /> */}
      </Canvas>
    </div>
  );
};

export default PowerUnitResults3D;
