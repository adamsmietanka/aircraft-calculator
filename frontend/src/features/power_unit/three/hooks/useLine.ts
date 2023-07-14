import { useEffect, useMemo, useState } from "react";
import { useThemeStore } from "../../../settings/stores/useTheme";
import {
  OPACITY_DELAY,
  OPACITY_STAGGER,
  POSITION_ANIMATION_DURATION,
  POSITION_STAGGER,
  useCSSColors,
} from "../config";
import * as THREE from "three";
import usePrevious from "../../../../hooks/usePrevious";
import { useFrame, useThree } from "@react-three/fiber";
import { Point } from "../Chart2D";


const useLine = (
  points: number[],
  fromRef: React.RefObject<THREE.BufferAttribute>,
  toRef: React.RefObject<THREE.BufferAttribute>,
  shaderMaterialRef: React.RefObject<THREE.ShaderMaterial>
) => {
  const { surfaceColor } = useCSSColors();
  const theme = useThemeStore((state) => state.theme);

  const color = useMemo(() => {
    return new THREE.Color(surfaceColor);
  }, [theme]);

  const index = useMemo(() => {
    return new Float32Array(Array.from(Array(points.length).keys()));
  }, []);

  const starting_position = useMemo(() => {
    return new Float32Array(Array(points.length * 3).fill(0));
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
        value: points.length,
      },
      u_color: { value: color },
    }),
    []
  );

  const [trace, setTrace] = useState(new Float32Array());
  const oldTrace: Float32Array = usePrevious(trace);

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
    let array = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      let i3 = i * 3;
      array[i3 + 0] = points[i][0];
      array[i3 + 1] = points[i][1];
      array[i3 + 2] = 0;
    }
    setTrace(array);
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.u_time_start.value =
        clock.getElapsedTime();
    }
  }, [points]);

  return { index, starting_position, uniforms };
};

export default useLine;
