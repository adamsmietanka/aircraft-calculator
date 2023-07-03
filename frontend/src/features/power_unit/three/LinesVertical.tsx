import { useRef } from "react";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import { TraceProps } from "./Chart2D";
import useLinesVertical from "./hooks/useLinesVertical";

const LinesVertical = ({ trace, ...props }: TraceProps) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);

  const { index, starting_position, uniforms } = useLinesVertical(
    trace,
    fromRef,
    toRef,
    shaderMaterialRef
  );

  return (
    <mesh position-x={-7.5} {...props}>
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
    </mesh>
  );
};

export default LinesVertical;
