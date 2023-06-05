import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SurfaceCp from "./SurfaceCp";
import SurfaceEff from "./SurfaceEff";
import GridLines from "./GridLines";

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[-10, 10, 10]} />
    </>
  );
};

const PowerUnitResults3D = () => {
  return (
    <div className="h-1/2 w-full">
      <Canvas orthographic camera={{ zoom: 30, position: [-10, 10, 15] }}>
        <Lights />
        <SurfaceCp position={[-1, 0, 0]} />
        <SurfaceEff position={[-1, 0, 10]} />
        <GridLines />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.25}
          target={[2.5, 1, 7.5]}
        />
      </Canvas>
    </div>
  );
};

export default PowerUnitResults3D;
