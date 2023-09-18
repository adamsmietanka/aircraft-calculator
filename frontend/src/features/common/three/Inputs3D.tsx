import React from "react";
import { CANVAS_WIDTH } from "./config";
import AnimatedHtml from "./AnimatedHtml";

interface Props {
  gridPositionX: number;
  children: React.ReactNode;
}

const Inputs3D = ({ gridPositionX, children }: Props) => {
  return (
    <mesh position-x={(gridPositionX * CANVAS_WIDTH) / 2}>
      <AnimatedHtml>
        <div className="space-y-2">{children}</div>
      </AnimatedHtml>
    </mesh>
  );
};

export default Inputs3D;
