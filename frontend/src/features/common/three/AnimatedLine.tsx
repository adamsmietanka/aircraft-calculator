import { Line } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Line2, LineGeometry } from "three-stdlib";
import { useCSSColors } from "./config";
import { SpringValue } from "@react-spring/three";
import { invalidate, useFrame } from "@react-three/fiber";
import { ALine } from "./ALine";

interface Props {
  points: SpringValue<number[]>;
  opacity: SpringValue<number>;
  width: SpringValue<number>;
}

const AnimatedLine = ({ points, opacity, width }: Props) => {
  const { gridColor } = useCSSColors();

  const lineRef = useRef<Line2>(null);

  const [_, force] = useState([]);

  useFrame(() => {
    const interpolatedPoints = points.get();
    const interpolatedOpacity = opacity.get();
    const interpolatedWidth = width.get();

    if (points.animation.changed) {
        force([]);
    }

    if (lineRef.current) {
      lineRef.current.geometry.setPositions(interpolatedPoints);
      lineRef.current.computeLineDistances();
      lineRef.current.material.opacity = interpolatedOpacity;
      lineRef.current.material.linewidth = interpolatedWidth;
    }
  });

//   useEffect(() => {
//     force([]);
//     console.log(1);
//     const timer = setTimeout(() => {
//       force([]);
//       console.log(1234);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [lineRef.current]);

  return (
    <Line
      ref={lineRef}
      points={[0, 0, -1, 0.1, 1, -1, 0.2, 0, -1]}
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
