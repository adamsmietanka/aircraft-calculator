import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  GRID_WIDTH,
  NUMBERS_PADDING,
  TITLE_PADDING,
  useCSSColors,
} from "./config";

const vertical_ticks = [0, 0.2, 0.4, 0.6, 0.8, 1];

const BackMesh = () => {
  const backMeshRef = useRef<THREE.Group>(null);

  const { gridColor } = useCSSColors();

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
          key={i}
          points={[
            [60, i, 0],
            [60, i, 15],
          ]}
          color={gridColor}
          lineWidth={i % 5 === 0 ? GRID_WIDTH * 2 : GRID_WIDTH}
        />
      ))}
      {/* vertical lines */}
      {Array.from(Array(16).keys()).map((i) => (
        <Line
          key={i}
          points={[
            [60, 0, i],
            [60, 1, i],
          ]}
          color={gridColor}
          lineWidth={i % 5 === 0 ? GRID_WIDTH * 2 : GRID_WIDTH}
        />
      ))}
    </group>
  );
};

const SideMesh = () => {
  const sideMeshRef = useRef<THREE.Group>(null);
  const verticalNumbersRef = useRef<THREE.Group>(null);
  const { gridColor } = useCSSColors();

  useFrame((state, dt) => {
    if (sideMeshRef.current && verticalNumbersRef.current) {
      sideMeshRef.current.position.z = state.camera.position.z > 7.5 ? 0 : 15;
      verticalNumbersRef.current.position.z =
        state.camera.position.z > 7.5 ? -NUMBERS_PADDING : NUMBERS_PADDING;
      verticalNumbersRef.current.position.x =
        state.camera.position.x > 2.5 ? 0 : -60;
    }
  });

  return (
    <group ref={sideMeshRef}>
      <group ref={verticalNumbersRef}>
        {vertical_ticks.map((i) => (
          <Html
            key={i}
            className="select-none text-xs"
            position={[65, i, 0]}
            center
          >
            {i}
          </Html>
        ))}
      </group>
      {/* horizontal lines */}
      {vertical_ticks.map((i) => (
        <Line
          key={i}
          points={[
            [10, i, 0],
            [60, i, 0],
          ]}
          color={gridColor}
          lineWidth={i % 5 === 0 ? GRID_WIDTH * 2 : GRID_WIDTH}
        />
      ))}
      {/* vertical lines */}
      {Array.from(Array(6).keys()).map((i) => (
        <Line
          key={i}
          points={[
            [10 + i * 10, 0, 0],
            [10 + i * 10, 1, 0],
          ]}
          color={gridColor}
          lineWidth={i % 5 === 0 ? GRID_WIDTH * 2 : GRID_WIDTH}
        />
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
        state.camera.position.z > 7.5 ? NUMBERS_PADDING : -NUMBERS_PADDING;
      titleRef.current.position.z =
        state.camera.position.z > 7.5 ? TITLE_PADDING : -TITLE_PADDING;
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
          <Html
            key={angle}
            className="select-none text-xs"
            position={[angle, 0, 0]}
            center
          >
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
          ? 10 * NUMBERS_PADDING
          : -10 * NUMBERS_PADDING;
      titleRef.current.position.x =
        state.camera.position.x > 2.5
          ? 10 * TITLE_PADDING
          : -10 * TITLE_PADDING;
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
          <Html
            key={j}
            className="select-none text-xs"
            position={[0, 0, j]}
            center
          >
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
