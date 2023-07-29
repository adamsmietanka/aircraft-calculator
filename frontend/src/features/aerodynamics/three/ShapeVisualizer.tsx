import React from "react";
import Line from "../../power_unit/three/Line";
import { Trace } from "../../power_unit/three/LineChart";
import { useThree } from "@react-three/fiber";
import { useCSSColors } from "../../power_unit/three/config";

interface ShapeProps {
  traces: Trace[];
}

const ShapeVisualizer = ({ traces }: ShapeProps) => {
  const { viewport } = useThree();
  const scale = 0.99 * viewport.width;
  
  const { primaryColor, secondaryColor, accentColor, errorColor } =
    useCSSColors();

  const colors = [primaryColor, secondaryColor, accentColor];

  return (
    <mesh position={[-0.5 * scale, 0, 0]} scale={scale}>
      {traces.map((trace, index) => (
        <Line trace={trace} scale={[1, 1, 1]} color={colors[index]} />
      ))}
    </mesh>
  );
};

export default ShapeVisualizer;
