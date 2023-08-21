import { Html } from "@react-three/drei";
import React from "react";
import { CANVAS_WIDTH } from "./config";

interface Props {
  size: number[];
  gridPositionX: number;
  children: React.ReactNode;
}

const Inputs3D = ({ size, gridPositionX, children }: Props) => {
  return (
    <mesh position-x={(gridPositionX * size[0] * CANVAS_WIDTH) / 2}>
      <Html className="select-none" color="black" transform prepend>
        {children}
      </Html>
    </mesh>
  );
};

export default Inputs3D;
