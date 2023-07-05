import { useRef } from "react";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import useLinesHorizontal from "./hooks/useLinesHorizontal";
import { Html } from "@react-three/drei";
import { NUMBERS_PADDING, TITLE_PADDING } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { Axis } from "./Chart2D";
import { useFrame } from "@react-three/fiber";

interface AxisProps {
  ticks: number[];
  axis: Axis;
}

const LinesHorizontal = ({ ticks, axis }: AxisProps) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);

  const { index, starting_position, uniforms } = useLinesHorizontal(
    ticks,
    fromRef,
    toRef,
    shaderMaterialRef
  );

  const { displayMultiplier, valueMultiplier, unit } = useChartUnits(
    axis.type as string
  );

  return (
    <>
      <mesh>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              ref={fromRef}
              attach="attributes-positionFrom"
              count={starting_position.length / 3}
              array={starting_position.slice()}
              itemSize={3}
            />
            <bufferAttribute
              ref={toRef}
              attach="attributes-position"
              count={starting_position.length / 3}
              array={starting_position}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-index"
              array={index}
              itemSize={1}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={shaderMaterialRef}
            // blending={THREE.AdditiveBlending}
            uniforms={uniforms}
            vertexShader={vertex}
            fragmentShader={fragment}
          />
        </lineSegments>

        {ticks.map((j) => (
          <Html
            key={j}
            className="select-none text-xs"
            position={[-NUMBERS_PADDING, j * valueMultiplier, 0]}
            center
          >
            {j * displayMultiplier}
          </Html>
        ))}
      </mesh>
      <Html
        className="select-none w-24"
        position={[-1.5 * TITLE_PADDING, 5, 0]}
        center
      >
        {`${axis.name} [${unit}]`}
      </Html>
    </>
  );
};

export default LinesHorizontal;
