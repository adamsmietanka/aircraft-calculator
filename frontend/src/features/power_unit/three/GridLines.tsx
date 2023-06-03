import { Line } from "@react-three/drei";
import React from "react";

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
  const width = 0.3;
  return (
    <mesh>
      {Array.from(Array(16).keys()).map((i) => (
        <Line
          fog
          points={[
            [i - 5, 0, -5],
            [i - 5, 0, 20],
          ]}
          //   vertexShader={vertexShader}
          //   fragmentShader={fragmentShader}
          color="inherit"
          lineWidth={i % 5 === 0 ? width * 2 : width}
        />
      ))}
      {Array.from(Array(26).keys()).map((j) => (
        <Line
          fog
          points={[
            [-5, 0, j - 5],
            [10, 0, j - 5],
          ]}
          //   vertexShader={vertexShader}
          //   fragmentShader={fragmentShader}
          color="inherit"
          lineWidth={j % 5 === 0 ? width * 2 : width}
        />
      ))}
    </mesh>
  );
};

export default GridLines;
