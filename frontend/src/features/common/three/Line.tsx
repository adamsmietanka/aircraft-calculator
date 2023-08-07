import { useRef } from "react";
import { animated, useSpring, config, SpringRef } from "@react-spring/three";
import { extend, useFrame } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Object3DNode, MaterialNode } from "@react-three/fiber";
import { Trace } from "./LineChart";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

extend({ MeshLineGeometry, MeshLineMaterial });

interface TraceProps {
  trace: Trace;
  scale?: number[];
  color: string;
  springRef?: SpringRef;
}

const Line = ({ trace, scale, color, springRef }: TraceProps) => {
  const test = useSpring({
    ref: springRef,
    from: { offset: 1 },
    to: { offset: 0 },
    config: config.slow,
  });

  const [marker] = useSpring(
    () => ({
      points: trace.points.flat(),
      scale,
    }),
    [trace, scale]
  );

  const geometryRef = useRef<MeshLineGeometry>(null);
  const materialRef = useRef<MeshLineMaterial>(null);

  useFrame(() => {
    const interpolatedPoints = marker.points.get();
    const interpolatedOffset = test.offset.get();

    if (geometryRef.current && materialRef.current) {
      materialRef.current.dashOffset = interpolatedOffset;
      materialRef.current.dashRatio = interpolatedOffset;
      geometryRef.current.setPoints(interpolatedPoints);
    }
  });

  return (
    <animated.mesh scale={marker.scale}>
      <meshLineGeometry ref={geometryRef} points={[0, 0, 0]} />
      <meshLineMaterial
        ref={materialRef}
        dashArray={1}
        dashOffset={1}
        dashRatio={0.5}
        transparent
        lineWidth={0.015}
        color={color}
      />
    </animated.mesh>
  );
};

export default Line;
