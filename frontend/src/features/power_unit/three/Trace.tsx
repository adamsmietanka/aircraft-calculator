import { ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useEngineStore } from "../stores/useEngine";
import { usePower } from "../hooks/usePower";
import {
  OPACITY_DELAY,
  OPACITY_STAGGER,
  POSITION_ANIMATION_DURATION,
  POSITION_STAGGER,
  useCSSColors,
} from "./config";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import { useThemeStore } from "../../settings/stores/useTheme";
import usePrevious from "../../../hooks/usePrevious";

const Trace = (props: ThreeElements["mesh"]) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);

  const heights = useEngineStore((state) => state.heights);

  const [trace, setTrace] = useState(new Float32Array());
  const oldTrace: Float32Array = usePrevious(trace);

  const [calculatePower] = usePower();
  
  const { surfaceColor } = useCSSColors();
  const theme = useThemeStore((state) => state.theme);

  const color = useMemo(() => {
    return new THREE.Color(surfaceColor)
  }, [theme])

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
      u_color: { value:  color},
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.u_time.value = clock.getElapsedTime();
      shaderMaterialRef.current.uniforms.u_color.value = color;
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
  }, [calculatePower]);

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
