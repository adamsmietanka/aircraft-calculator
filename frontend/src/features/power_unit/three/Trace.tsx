import { useRef } from "react";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import useLine from "./hooks/useLine";
import { Point } from "./Chart2D";
import { animated, useSpring } from "@react-spring/three";

interface TraceProps {
  trace: Point[];
  scale?: number[];
}

const Trace = ({ trace, scale }: TraceProps) => {
  const [spring] = useSpring(
    () => ({
      scale,
    }),
    [scale]
  );

  return (
    <animated.mesh scale={spring.scale}>
      <Line trace={trace} />
      <Line trace={trace} position-y={0.03} />
      <Line trace={trace} position-x={0.03} />
      <Line trace={trace} position-y={-0.03} />
      <Line trace={trace} position-x={-0.03} />
    </animated.mesh>
  );
};

const Line = ({ trace, scale, ...props }: TraceProps) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);

  const { index, starting_position, uniforms } = useLine(
    trace,
    fromRef,
    toRef,
    shaderMaterialRef
  );

  return (
    <mesh {...props}>
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
