import React from "react";
import Line from "../../power_unit/three/Line";
import { Trace } from "../../power_unit/three/LineChart";
import { useThree } from "@react-three/fiber";

interface ShapeProps {
  traces: Trace[];
}

const ShapeVisualizer = ({ traces }: ShapeProps) => {
  const { viewport } = useThree();
  const scale = viewport.width * 0.9;

  const colors = ["green", "yellow", "blue"];

  return (
    <mesh position={[-0.45 * scale, 0, 0]} scale={scale}>
      {traces.map((trace, index) => (
        <Line trace={trace} scale={[1, 1, 1]} color={colors[index]} />
      ))}
    </mesh>
  );
};

export default ShapeVisualizer;
