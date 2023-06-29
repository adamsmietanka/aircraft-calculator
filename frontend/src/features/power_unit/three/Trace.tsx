import { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useEngineStore } from "../stores/useEngine";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import useLine from "./hooks/useLine";

const Trace = (props: ThreeElements["mesh"]) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);

  const heights = useEngineStore((state) => state.heights);

  const { index, starting_position, uniforms } = useLine(
    heights,
    fromRef,
    toRef,
    shaderMaterialRef
  );

  return (
    <mesh {...props}>
      <line scale-y={0.005}>
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
