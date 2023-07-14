import { useRef } from "react";
import {
  animated,
  useSpring,
  config,
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

const Trace = ({ trace, scale }: TraceProps) => {
  const test = useSpring({
    delay: 250,
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.slow,
  });

  const [marker] = useSpring(
    () => ({
      points: trace.flat(),
      scale,
    }),
    [trace, scale]
  );

  const geometryRef = useRef<MeshLineGeometry>(null);
  const materialRef = useRef<MeshLineMaterial>(null);
  
  const { traceColor } = useCSSColors();

  useFrame(() => {
    const interpolatedPoints = marker.points.get();
    const interpolatedOpacity = test.opacity.get();

    if (geometryRef.current && materialRef.current) {
      materialRef.current.opacity = interpolatedOpacity;
      geometryRef.current.setPoints(interpolatedPoints);
    }
  });

  return (
    <animated.mesh scale={marker.scale}>
      <meshLineGeometry ref={geometryRef} points={[0, 0, 0]} />
      <meshLineMaterial
        ref={materialRef}
        lineWidth={0.02}
        color={traceColor}
        transparent
      />
    </animated.mesh>
  );
};

export default Trace;
