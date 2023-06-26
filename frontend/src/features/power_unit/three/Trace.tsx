import { ThreeElements, useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useEngineStore } from "../stores/useEngine";
import { usePower } from "../hooks/usePower";
import { useSuperchargerStore } from "../stores/useSupercharger";
import { useTurbochargerStore } from "../stores/useTurbocharger";
import {
  OPACITY_DELAY,
  OPACITY_STAGGER,
  POSITION_ANIMATION_DURATION,
  POSITION_STAGGER,
} from "./config";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";

const Trace = (props: ThreeElements["mesh"]) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);
  const engine = useEngineStore();
  const supercharger = useSuperchargerStore();
  const turbocharger = useTurbochargerStore();
  const [trace, setTrace] = useState(new Float32Array());
  const [oldTrace, setOldTrace] = useState(new Float32Array());

  const heights = engine.heights;
  const [calculatePower] = usePower();

  const index = useMemo(() => {
    return new Float32Array(Array.from(Array(heights.length).keys()));
  }, []);

  const starting_position = useMemo(() => {
    return new Float32Array(Array(heights.length * 3).fill(0));
  }, []);

  const starting_position_from = useMemo(() => {
    return new Float32Array(Array(heights.length * 3).fill(0));
  }, []);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_time_start: {
        value: 0.0,
      },
      u_position_duration: {
        value: POSITION_ANIMATION_DURATION,
      },
      u_position_stagger: {
        value: POSITION_STAGGER,
      },
      u_opacity_stagger: {
        value: OPACITY_STAGGER,
      },
      u_opacity_delay: {
        value: OPACITY_DELAY,
      },
      u_count: {
        value: heights.length,
      },
      u_colorA: { value: new THREE.Color("#FFE486") },
      u_colorB: { value: new THREE.Color("#FEB3D9") },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    }
    if (toRef.current && fromRef.current) {
      fromRef.current.set(oldTrace);
      toRef.current.set(trace);
      fromRef.current.needsUpdate = true;
      toRef.current.needsUpdate = true;
    }
  });
  const { clock } = useThree();

  useEffect(() => {
    setOldTrace(trace);
    let array = new Float32Array(heights.length * 3);
    for (let i = 0; i < heights.length; i++) {
      let i3 = i * 3;
      array[i3 + 0] = heights[i];
      array[i3 + 1] = calculatePower(heights[i]);
      array[i3 + 2] = 0;
    }
    setTrace(array);
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.u_time_start.value =
        clock.getElapsedTime();
    }
  }, [engine, supercharger, turbocharger]);
  return (
    <mesh {...props}>
      <line scale-y={0.005}>
        <bufferGeometry>
          <bufferAttribute
            ref={fromRef}
            attach="attributes-positionFrom"
            count={starting_position_from.length / 3}
            array={starting_position_from}
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
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
        />
      </line>
    </mesh>
  );
};

export default Trace;
