import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Interpolation, SpringValue, useSpring } from "@react-spring/three";
import { Line2, LineSegments2, LineMaterialParameters } from "three-stdlib";

import { useCSSColors } from "./config";
import { styles } from "./utils/lineStyles";

type Props = {
  points: number[][];
  scale?: number[];
  opacity?: number | SpringValue<number> | Interpolation<number>;
  offset?: number;
  width?: SpringValue<number> | number;
  color?: string;
  style?: string;
  segments?: boolean;
} & Omit<LineMaterialParameters, "opacity" | "color" | "vertexColors">;

const AnimatedLine = ({
  points,
  scale = [1, 1, 1],
  opacity = 1,
  offset = 0,
  width = 3,
  color = "primary",
  style = "normal",
  segments = false,
  ...rest
}: Props) => {
  const { colors } = useCSSColors();

  const lineRef = useRef<Line2 | LineSegments2>(null);

  const [lineSpring] = useSpring(
    () => ({
      points: points
        .map(([x, y, z]) => [x * scale[0], y * scale[1], z * scale[2]])
        .flat(),
      opacity,
      width: styles[style]?.width || width,
      offset: styles[style]?.offset || 0,
    }),
    [points, scale, opacity, width]
  );

  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.geometry.setPositions(lineSpring.points.get());
      lineRef.current.computeLineDistances();

      lineRef.current.material.opacity = lineSpring.opacity.get();
      lineRef.current.material.linewidth = lineSpring.width.get();
      lineRef.current.material.dashOffset -= offset;
    }
  });

  return (
    <Line
      ref={lineRef}
      dashed
      points={[0, 0, 0, 1, 0, 0]}
      color={colors[color] || color}
      segments={segments}
      transparent
      {...styles[style]}
      {...rest}
    />
  );
};

export default AnimatedLine;
