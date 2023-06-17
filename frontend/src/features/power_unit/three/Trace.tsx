import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useEngineStore } from "../stores/useEngine";
import { usePower } from "../hooks/usePower";
import { useSuperchargerStore } from "../stores/useSupercharger";
import { useTurbochargerStore } from "../stores/useTurbocharger";
import { OPACITY_DELAY, OPACITY_STAGGER, POSITION_ANIMATION_DURATION, POSITION_STAGGER } from "./config";

const easingsShader = `
    float linear(float x) {
    float X = clamp(x, 0.0, 1.0);
    return X;
    }

    float cubic_in_out(float x) {
        float X = clamp(x, 0.0, 1.0);
        if (X < 0.5) {
            return 4.0 * pow(X, 3.0) ;
        }
        else if (X <= 1.0) {
            return 1.0 - pow(-2.0 * X + 2.0, 3.0) / 2.0;
        }
    }
  
  // float sine_out(float x) {
  //   float X = clamp(x, 0.0, 1.0);
  //   return Math.sin((X * Math.PI) / 2);
  // }

  float quadratic_out(float x) {
    float X = clamp(x, 0.0, 1.0);
    return X * X;
  }
`;

const vertexShader = `
    uniform float u_time;
    uniform float u_time_start;
    uniform float u_position_duration;
    uniform float u_position_stagger;
    uniform float u_count;
    attribute vec3 positionFrom;
    attribute float index;
    varying float v_index;
  
  ${easingsShader}

  void main() {
    v_index = index;

    float point_delay = linear(index / u_count) * u_position_stagger;
    float point_start = u_time_start + point_delay;
    float x = (u_time - point_start) / u_position_duration;
    float inter = cubic_in_out(x);

    vec3 new_position = mix(positionFrom, position, inter);
    vec4 modelPosition = modelMatrix * vec4(new_position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_PointSize = 1.0 * (100.0 / -viewPosition.z);
  
    gl_Position = projectedPosition;
  }
`;

const fragmentShader = `
uniform float u_time;
uniform float u_opacity_stagger;
uniform float u_opacity_delay;
uniform float u_count;
varying float v_index;

vec3 colorA = vec3(0.912,0.191,0.652);
vec3 colorB = vec3(1.000,0.777,0.052);

float opacity_change_delay = 0.5;
float opacity_change_duration = 0.2;
  
${easingsShader}

void main() {
  vec3 color = mix(colorA, colorB, 1.0);
  gl_FragColor.rgb = color;
  
  float point_delay = u_opacity_delay + linear(v_index / u_count) * u_opacity_stagger;
  gl_FragColor.a = clamp((u_time - point_delay) / opacity_change_duration, 0.0, 1.0);
  
  // if (distance(gl_PointCoord, vec2(0.5)) > 0.5) {
  //   gl_FragColor.a = 0.0;
  // }
}
`;

const Trace = () => {
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
        <bufferAttribute attach="attributes-index" array={index} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderMaterialRef}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </line>
  );
};

export default Trace;
