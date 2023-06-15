import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Trace from "./Trace";

const Chart2D = () => {

  return (
    <div className="h-2/5 w-full">
      <Canvas orthographic camera={{ zoom: 30, position: [0, 10, 0] }}>
        <gridHelper />
        <Trace />
      </Canvas>
    </div>
  );
};

export default Chart2D;
