import React from "react";
import Line from "../../power_unit/three/Line";
import { Trace } from "../../power_unit/three/LineChart";
import { useThree } from "@react-three/fiber";

interface ShapeProps {
  trace: Trace;
}

const ShapeVisualizer = ({ trace }: ShapeProps) => {
  const { viewport } = useThree();
  const scale = viewport.width;

  return (
    <mesh position={[-0.5 * scale, 0, 0]} scale={scale}>
      <Line trace={trace} scale={[1, 1, 1]} color={"red"} />
    </mesh>
  );
};

export default ShapeVisualizer;
