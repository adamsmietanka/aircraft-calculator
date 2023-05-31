import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

interface Props {
  name: string;
}

const VerticalAxis = ({ name }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (groupRef.current) {
      groupRef.current.position.x = state.camera.position.x > 3.5 ? -50 : 0;
    }
    console.log();
  });
  return (
    <group ref={groupRef}>
      <Line
        points={[
          [60, 0, 0],
          [60, 1, 0],
        ]}
        color="inherit"
        lineWidth={1.25}
      />
      <Html className="select-none" position={[70, 0.5, -1]} center>
        {name}
      </Html>
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((i) => (
        <>
          <Html className="select-none text-xs" position={[65, i, -0.5]} center>
            {i}
          </Html>
          <Line
            points={[
              [60, i, 0],
              [60, i, 11],
            ]}
            color="inherit"
            lineWidth={1.25}
          />
        </>
      ))}
    </group>
  );
};

export default VerticalAxis;
