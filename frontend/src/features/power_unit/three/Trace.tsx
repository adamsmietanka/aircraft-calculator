import { useEffect, useRef, useState } from "react";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import useLine from "./hooks/useLine";
import { Point } from "./Chart2D";
import {
  animated,
  a,
  useSpring,
  config,
  useTrail,
  SpringValue,
} from "@react-spring/three";
import { extend, useFrame } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Object3DNode, MaterialNode } from "@react-three/fiber";
import { useCSSColors } from "./config";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

extend({ MeshLineGeometry, MeshLineMaterial });

interface TraceProps {
  trace: number[][];
  scale?: number[];
}

interface LineProps {
  start: number[];
  end: number[];
  opacity: SpringValue<number>;
}

const Line = ({ start, end, opacity }: LineProps) => {
  const geometryRef = useRef<MeshLineGeometry>(null);
  const materialRef = useRef<MeshLineMaterial>(null);

  const { traceColor } = useCSSColors();
  const [marker] = useSpring(
    () => ({
      start,
      end,
    }),
    [start, end]
  );

  useFrame(() => {
    const interpolatedStart = marker.start.get();
    const interpolatedEnd = marker.end.get();
    const interpolatedOpacity = opacity.get();
    console.log(interpolatedStart);

    if (geometryRef.current && materialRef.current) {
      materialRef.current.opacity = interpolatedOpacity;
      geometryRef.current.setPoints([...interpolatedStart, ...interpolatedEnd]);
    }
  });

  return (
    <mesh>
      <meshLineGeometry ref={geometryRef} points={[0, 0, 0]} />
      <meshLineMaterial
        ref={materialRef}
        lineWidth={0.02}
        color={traceColor}
        transparent
        opacity={1}
        // sizeAttenuation={true}
      />
    </mesh>
  );
};

const Trace = ({ trace, scale }: TraceProps) => {
  const [spring] = useSpring(
    () => ({
      scale,
    }),
    [scale]
  );

  const opacityTrail = useTrail(trace.length - 1, {
    // ref: markersRef,
    delay: 500,
    from: { opacity: 0 },
    to: { opacity: 1 },
    opacity: 0,
  });

  const test = useSpring({
    delay: 500,
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.slow,
  });

  // const [marker] = useSpring(
  //   () => ({
  //     start: [trace[0].x, trace[0].y, 0],
  //     end: [trace[10].x, trace[10].y, 0],
  //   }),
  //   [trace]
  // );

  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<MeshLineGeometry>(null);

  // useFrame(() => {
  //   const interpolatedX = test.opacity.get();
  //   const interpolatedStart = marker.start.get();
  //   const interpolatedEnd = marker.end.get();
  //   console.log(interpolatedStart);
  //   // position.set([interpolatedX], 0);
  //   // position.set([interpolatedX], 3);

  //   if (meshRef.current && geometryRef.current) {
  //     // console.log(geometryRef.current);
  //     meshRef.current.material.opacity = interpolatedX;
  //     geometryRef.current.setPoints([...interpolatedStart, ...interpolatedEnd]);
  //     // meshRef.current.set(position);
  //     // meshRef.current.needsUpdate = true;
  //   }
  // });

  return (
    <animated.mesh scale={spring.scale}>
      {opacityTrail.map((i, index) => (
        <Line
          key={index}
          start={trace[index]}
          end={trace[index + 1]}
          opacity={i.opacity}
        />
      ))}
    </animated.mesh>
  );
};

// const MyLine = ({ trace, scale, ...props }: TraceProps) => {
//   const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
//   const fromRef = useRef<THREE.BufferAttribute>(null);
//   const toRef = useRef<THREE.BufferAttribute>(null);

//   const { index, starting_position, uniforms } = useLine(
//     trace,
//     fromRef,
//     toRef,
//     shaderMaterialRef
//   );

//   return (
//     <mesh {...props}>
//       <line>
//         <bufferGeometry>
//           <bufferAttribute
//             ref={fromRef}
//             attach="attributes-positionFrom"
//             count={starting_position.length / 3}
//             array={starting_position.slice()}
//             itemSize={3}
//           />
//           <bufferAttribute
//             ref={toRef}
//             attach="attributes-position"
//             count={starting_position.length / 3}
//             array={starting_position}
//             itemSize={3}
//           />
//           <bufferAttribute
//             attach="attributes-index"
//             array={index}
//             itemSize={1}
//           />
//         </bufferGeometry>
//         <shaderMaterial
//           ref={shaderMaterialRef}
//           // blending={THREE.AdditiveBlending}
//           uniforms={uniforms}
//           vertexShader={vertex}
//           fragmentShader={fragment}
//         />
//       </line>
//     </mesh>
//   );
// };

export default Trace;
