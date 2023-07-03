import { useRef } from "react";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import useLinesVertical from "./hooks/useLinesVertical";
import { Html } from "@react-three/drei";
import { NUMBERS_PADDING, TITLE_PADDING } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";

interface AxisProps {
  ticks: number[];
}

const LinesVertical = ({ ticks, ...props }: AxisProps) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);

  const { index, starting_position, uniforms } = useLinesVertical(
    ticks,
    fromRef,
    toRef,
    shaderMaterialRef
  );

  const { displayMultiplier, valueMultiplier, unit } = useChartUnits();

  return (
    <group {...props}>
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
      {ticks.map((i) => (
        <Html
          key={i}
          className="select-none text-xs"
          position={[i * valueMultiplier, -NUMBERS_PADDING, 0]}
          center
        >
          {i * displayMultiplier}
        </Html>
      ))}
      <Html
        className="select-none w-24"
        position={[7.5, -TITLE_PADDING, 0]}
        center
      >
        {`Altitude [${unit}]`}
      </Html>
    </group>
  );
};

export default LinesVertical;
