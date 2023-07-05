import { useRef } from "react";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import useLine from "./hooks/useLine";
import { TraceProps } from "./Chart2D";
import { useFrame } from "@react-three/fiber";

const Trace = ({ trace, scale, ...props }: TraceProps) => {
  return (
    <group>
      <Line trace={trace} scale={scale} />
      <Line trace={trace} scale={scale} position-y={0.03} />
      <Line trace={trace} scale={scale} position-x={0.03} />
      <Line trace={trace} scale={scale} position-y={-0.03} />
      <Line trace={trace} scale={scale} position-x={-0.03} />
    </group>
  );
};

const Line = ({ trace, scale, ...props }: TraceProps) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const { index, starting_position, uniforms } = useLine(
    trace,
    fromRef,
    toRef,
    shaderMaterialRef
  );

  // const { xTicks, yTicks, scaleY } = useAxisTicks(trace, xAxis, yAxis);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setY(scale[1]);
    }
  });

  return (
    <mesh ref={meshRef} {...props}>
      <line>
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
      </line>
    </mesh>
  );
};

export default Trace;
