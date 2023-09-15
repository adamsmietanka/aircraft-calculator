import { Line } from "@react-three/drei";
import { useRef } from "react";
import { Line2 } from "three-stdlib";
import { useCSSColors } from "./config";
import { SpringValue } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";

interface Props {
  points: SpringValue<number[]>;
  opacity: SpringValue<number>;
  width: SpringValue<number>;
}

const AnimatedLine = ({ points, opacity, width }: Props) => {
  const { gridColor, primaryColor, backgroundColor } = useCSSColors();

  const lineRef = useRef<Line2>(null);

  useFrame(() => {
    const interpolatedPoints = points.get();
    const interpolatedOpacity = opacity.get();
    const interpolatedWidth = width.get();
    console.log(lineRef.current, interpolatedPoints);

    if (lineRef.current) {
      lineRef.current.geometry.setPositions(interpolatedPoints);
      lineRef.current.computeLineDistances();
      lineRef.current.material.opacity = interpolatedOpacity;
      lineRef.current.material.linewidth = interpolatedWidth;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[
        [0, 0, -1],
        [0.1, 1, -1],
        [0.2, 0, -1],
      ]}
      lineWidth={0.5} // In pixels (default)
      dashed
      dashSize={0.25}
      gapSize={0.75}
      dashScale={3}
      opacity={0.5}
      color={gridColor}
      transparent
    />
  );
};

export default AnimatedLine;
