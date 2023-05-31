import { Line } from "@react-three/drei";
import React from "react";

const GridLines = () => {
  const width = 0.5;
  return (
    <mesh>
      {Array.from(Array(30).keys()).map((i) => (
        <Line
          fog
          points={[
            [i - 15, 0, -10],
            [i - 15, 0, 20],
          ]}
          color="inherit"
          lineWidth={width}
        />
      ))}
      {Array.from(Array(30).keys()).map((j) => (
        <Line
          fog
          points={[
            [-30, 0, j - 15],
            [100, 0, j - 15],
          ]}
          color="inherit"
          lineWidth={width}
        />
      ))}
      
    </mesh>
  );
};

export default GridLines;
