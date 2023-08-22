import { Html } from "@react-three/drei";
import React from "react";
import { CANVAS_WIDTH } from "./config";

interface Props {
  size: number[];
  gridPositionX: number;
  visible: boolean;
  children: React.ReactNode;
}

const Inputs3D = ({ size, gridPositionX, visible, children }: Props) => {
  return (
    <mesh position-x={(gridPositionX * size[0] * CANVAS_WIDTH) / 2}>
      <Html
        className={`select-none ${visible || "hidden"}`}
        transform
        prepend
        visible={visible}
      >
        {children}
      </Html>
    </mesh>
  );
};

export default Inputs3D;
