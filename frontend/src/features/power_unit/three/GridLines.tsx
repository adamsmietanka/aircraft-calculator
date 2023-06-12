import { Line } from "@react-three/drei";
import { GRID_WIDTH, useCSSColors } from "./config";

const vertexShader = `
  varying vec3 vColor;
  
  void main() {
    vColor = position.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
`;

const GridLines = () => {
  const { gridColor } = useCSSColors();
  return (
    <mesh>
      {Array.from(Array(16).keys()).map((i) => (
        <Line
          key={i}
          points={[
            [i - 5, 0, -5],
            [i - 5, 0, 20],
          ]}
          //   vertexShader={vertexShader}
          //   fragmentShader={fragmentShader}
          color={gridColor}
          lineWidth={i % 5 === 0 ? GRID_WIDTH * 2 : GRID_WIDTH}
        />
      ))}
      {Array.from(Array(26).keys()).map((j) => (
        <Line
          key={j}
          points={[
            [-5, 0, j - 5],
            [10, 0, j - 5],
          ]}
          //   vertexShader={vertexShader}
          //   fragmentShader={fragmentShader}
          color={gridColor}
          lineWidth={j % 5 === 0 ? GRID_WIDTH * 2 : GRID_WIDTH}
        />
      ))}
    </mesh>
  );
};

export default GridLines;
