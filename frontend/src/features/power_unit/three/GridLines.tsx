import { Line } from "@react-three/drei";
import {
  GRID_OPACITY,
  GRID_WIDTH,
  useCSSColors,
} from "../../common/three/config";

const GridLines = () => {
  const { gridColor } = useCSSColors();
  return (
    <mesh>
      {Array.from(Array(16).keys()).map((i) => (
        <Line
          key={i}
          points={[
            [i - 5, -0.01, -5],
            [i - 5, -0.01, 20],
          ]}
          transparent
          opacity={GRID_OPACITY}
          color={gridColor}
          lineWidth={i % 5 === 0 ? GRID_WIDTH * 2 : GRID_WIDTH}
        />
      ))}
      {Array.from(Array(26).keys()).map((j) => (
        <Line
          key={j}
          points={[
            [-5, -0.01, j - 5],
            [10, -0.01, j - 5],
          ]}
          color={gridColor}
          transparent
          opacity={GRID_OPACITY}
          lineWidth={j % 5 === 0 ? GRID_WIDTH * 2 : GRID_WIDTH}
        />
      ))}
    </mesh>
  );
};

export default GridLines;
