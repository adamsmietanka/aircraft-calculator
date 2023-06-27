import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Trace from "./Trace";

const Chart2D = () => {
  return (
    <div className="h-2/5 w-full">
      <Canvas orthographic camera={{ zoom: 30, position: [0, 0, 10] }}>
        <gridHelper rotation-x={Math.PI / 2} />
        <axesHelper />
        <mesh position-x={-7.5}>
          <Trace />
          <Trace position-y={0.025} />
          <Trace position-x={0.025} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Chart2D;
