import React from "react";
import { CANVAS_WIDTH } from "./config";
import AnimatedHtml from "./AnimatedHtml";

interface Props {
  gridPositionX: number;
  show?: boolean;
  children: React.ReactNode;
}

const Inputs3D = ({ gridPositionX, children, show = true }: Props) => {
  return (
    <mesh position-x={(gridPositionX * CANVAS_WIDTH) / 2}>
      <AnimatedHtml show={show}>
        <div className="space-y-2">{children}</div>
      </AnimatedHtml>
    </mesh>
  );
};

export default Inputs3D;
