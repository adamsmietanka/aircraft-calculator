import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
    uniform float u_time;
    uniform float u_time_start;
    uniform float u_duration;
    attribute vec3 positionFrom;
    attribute float index;

    float linear() {
        float x = (u_time - u_time_start) / u_duration;
        if (x < 0.0) {
            return 0.0;
        }
        else if (x < 1.0) {
            return x;
        }
        return 1.0;
    }

    float cubic_in_out() {
        float start = u_time_start + index * 0.2;
        float x = (u_time - start) / u_duration;
        if (x < 0.0) {
            return 0.0;
        }
        else if (x < 0.5) {
            return 4.0 * pow(x, 3.0) ;
        }
        else if (x < 1.0) {
            return 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
        }
        return 1.0;
    }
  
  void main() {
    float inter = cubic_in_out();
    vec3 new_position = mix(positionFrom, position, inter);
    vec4 modelPosition = modelMatrix * vec4(new_position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
  
    gl_Position = projectedPosition;
  }
`;

const fragmentShader = `

vec3 colorA = vec3(0.912,0.191,0.652);
vec3 colorB = vec3(1.000,0.777,0.052);

void main() {
  vec3 color = mix(colorA, colorB, 1.0);

  gl_FragColor = vec4(color,1.0);
}
`;

const Trace = () => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const index = useMemo(() => {
    return new Float32Array(Array.from(Array(4).keys()));
  }, []);

  const vertsFrom = new Float32Array([-1, 0, 0, 0, 0, 0, 2, -2, 0, 4, 0, 0]);
  const verts = new Float32Array([-1, 0, 0, 0, 1, 0, 2, 2, 0, 4, -1, 0]);

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
      u_colorA: { value: new THREE.Color("#FFE486") },
      u_colorB: { value: new THREE.Color("#FEB3D9") },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    //   console.log(clock.getElapsedTime())
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    }
  });
  return (
    <line>
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
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
      {/* <lineBasicMaterial color="red" linewidth={40} /> */}
    </line>
  );
};

export default Trace;
