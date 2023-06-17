import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

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
    uniform float u_duration;
    uniform float u_stagger_duration;
    uniform float u_count;
    attribute vec3 positionFrom;
    attribute float index;
    varying float v_index;
  
  ${easingsShader}

  void main() {
    v_index = index;

    float point_delay = cubic_in_out(index / u_count) * u_stagger_duration;
    float point_start = u_time_start + point_delay;
    float x = (u_time - point_start) / u_duration;
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
uniform float u_stagger_duration;
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
  
  float point_delay = linear(v_index / u_count) * u_stagger_duration;
  gl_FragColor.a = clamp((u_time - opacity_change_delay - point_delay) / opacity_change_duration, 0.0, 1.0);
  
  // if (distance(gl_PointCoord, vec2(0.5)) > 0.5) {
  //   gl_FragColor.a = 0.0;
  // }
}
`;

const Trace = () => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const index = useMemo(() => {
    return new Float32Array(Array.from(Array(5).keys()));
  }, []);

  const vertsFrom = new Float32Array([
    -3, -1, 0, -1, 0, 0, 0, 0, 0, 2, -2, 0, 4, 0, 0,
  ]);
  const verts = new Float32Array([
    -3, -1, 0, -1, 1, 0, 0, 1, 0, 2, 2, 0, 4, -1, 0,
  ]);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_time_start: {
        value: 1.0,
      },
      u_duration: {
        value: 1.0,
      },
      u_stagger_duration: {
        value: 0.5,
      },
      u_count: {
        value: 5.0,
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
  });
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-positionFrom"
          count={vertsFrom.length / 3}
          array={vertsFrom}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-position"
          count={verts.length / 3}
          array={verts}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-index" array={index} itemSize={1} />
        {/* <bufferAttribute attach="attributes-colors" args={[colors, 3]} /> */}
      </bufferGeometry>
      <shaderMaterial
        ref={shaderMaterialRef}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
};

export default Trace;
