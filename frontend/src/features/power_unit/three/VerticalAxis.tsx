import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

const width = 0.3;
const vertical_ticks = [0, 0.2, 0.4, 0.6, 0.8, 1];

const titlePadding = 1.5;
const numbersPadding = 0.5;

const BackMesh = () => {
  const backMeshRef = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (backMeshRef.current) {
      backMeshRef.current.position.x = state.camera.position.x > 2.5 ? -50 : 0;
    }
  });
  return (
    <group ref={backMeshRef}>
      {/* horizontal lines */}
      {vertical_ticks.map((i) => (
        <Line
          points={[
            [60, i, 0],
            [60, i, 15],
          ]}
          color="inherit"
          lineWidth={i % 5 === 0 ? width * 2 : width}
        />
      ))}
      {/* vertical lines */}
      {Array.from(Array(16).keys()).map((i) => (
        <>
          <Line
            points={[
              [60, 0, i],
              [60, 1, i],
            ]}
            color="inherit"
            lineWidth={i % 5 === 0 ? width * 2 : width}
          />
        </>
      ))}
    </group>
  );
};

const SideMesh = () => {
  const sideMeshRef = useRef<THREE.Group>(null);
  const verticalNumbersRef = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (sideMeshRef.current && verticalNumbersRef.current) {
      sideMeshRef.current.position.z = state.camera.position.z > 7.5 ? 0 : 15;
      verticalNumbersRef.current.position.z =
        state.camera.position.z > 7.5 ? -numbersPadding : numbersPadding;
      verticalNumbersRef.current.position.x =
        state.camera.position.x > 2.5 ? 0 : -60;
    }
  });
  return (
    <group ref={sideMeshRef}>
      <group ref={verticalNumbersRef}>
        {vertical_ticks.map((i) => (
          <Html className="select-none text-xs" position={[65, i, 0]} center>
            {i}
          </Html>
        ))}
      </group>
      {/* horizontal lines */}
      {vertical_ticks.map((i) => (
        <Line
          points={[
            [10, i, 0],
            [60, i, 0],
          ]}
          color="inherit"
          lineWidth={i % 5 === 0 ? width * 2 : width}
        />
      ))}
      {/* vertical lines */}
      {Array.from(Array(6).keys()).map((i) => (
        <>
          <Line
            points={[
              [10 + i * 10, 0, 0],
              [10 + i * 10, 1, 0],
            ]}
            color="inherit"
            lineWidth={i % 5 === 0 ? width * 2 : width}
          />
        </>
      ))}
    </group>
  );
};

const Angle = () => {
  const axisRef = useRef<THREE.Group>(null);
  const numbersRef = useRef<THREE.Group>(null);
  const titleRef = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (axisRef.current && numbersRef.current && titleRef.current) {
      axisRef.current.position.z = state.camera.position.z > 7.5 ? 15 : 0;
      numbersRef.current.position.z =
        state.camera.position.z > 7.5 ? numbersPadding : -numbersPadding;
      titleRef.current.position.z =
        state.camera.position.z > 7.5 ? titlePadding : -titlePadding;
    }
  });
  return (
    <group ref={axisRef}>
      <group ref={titleRef}>
        <Html className="select-none" position={[35, 0, 0]} center>
          Angle
        </Html>
      </group>
      <group ref={numbersRef}>
        {[10, 20, 30, 40, 50, 60].map((angle) => (
          <Html className="select-none text-xs" position={[angle, 0, 0]} center>
            {angle}
          </Html>
        ))}
      </group>
    </group>
  );
};

const J = () => {
  const axisRef = useRef<THREE.Group>(null);
  const numbersRef = useRef<THREE.Group>(null);
  const titleRef = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (axisRef.current && numbersRef.current && titleRef.current) {
      axisRef.current.position.x = state.camera.position.x > 2.5 ? 60 : 10;
      numbersRef.current.position.x =
        state.camera.position.x > 2.5
          ? 10 * numbersPadding
          : -10 * numbersPadding;
      titleRef.current.position.x =
        state.camera.position.x > 2.5 ? 10 * titlePadding : -10 * titlePadding;
    }
  });
  return (
    <group ref={axisRef}>
      <group ref={titleRef}>
        <Html className="select-none" position={[0, 0, 2.5]} center>
          J
        </Html>
      </group>
      <group ref={numbersRef}>
        {[0, 1, 2, 3, 4, 5].map((j) => (
          <Html className="select-none text-xs" position={[0, 0, j]} center>
            {j}
          </Html>
        ))}
      </group>
    </group>
  );
};

const VerticalAxis = () => {
  return (
    <group>
      <Html className="select-none" position={[70, 0.5, -1]} center>
        Cp
      </Html>
      <BackMesh />
      <SideMesh />
      <Angle />
      <J />
    </group>
  );
};

export default VerticalAxis;
