import { useRef } from "react";
import {
  animated,
  useSpring,
  config,
  SpringRef,
  SpringValue,
} from "@react-spring/three";
import { extend, useFrame } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Object3DNode, MaterialNode } from "@react-three/fiber";
import { Trace } from "./LineChart";
import { useCSSColors } from "./config";

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
  width?: number;
  color?: string;
  style?: string;
  springRef?: SpringRef;
  opacity?: SpringValue<number>;
}

const Line = ({
  trace,
  scale = [1, 1, 1],
  width = 1,
  color = "primary",
  style = "",
  springRef,
  opacity,
}: TraceProps) => {
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

  const { colors } = useCSSColors();

  const geometryRef = useRef<MeshLineGeometry>(null);
  const materialRef = useRef<MeshLineMaterial>(null);

  useFrame(() => {
    const interpolatedPoints = marker.points.get();

    if (geometryRef.current && materialRef.current) {
      geometryRef.current.setPoints(interpolatedPoints);
    }

    if (!style) {
      const interpolatedOffset = test.offset.get();
      const interpolatedOpacity = opacity ? opacity?.get() : 1;

      if (geometryRef.current && materialRef.current) {
        materialRef.current.dashOffset = interpolatedOffset;
        materialRef.current.dashRatio = interpolatedOffset;
        materialRef.current.opacity = interpolatedOpacity;
      }
    }
  });

  const styles: Record<string, Record<string, number>> = {
    dotted: { array: 0.01, width: 0.5 },
    thin: { array: 0.05, width: 0.2 },
    normal: { array: 1, width: 1 },
  };

  return (
    <animated.mesh scale={marker.scale}>
      <meshLineGeometry ref={geometryRef} points={[0, 0, 0]} />
      <meshLineMaterial
        ref={materialRef}
        dashArray={styles[style]?.array || 1}
        dashOffset={1}
        dashRatio={0.5}
        transparent
        lineWidth={(styles[style]?.width || width) * 0.1}
        color={colors[color] || color}
      />
    </animated.mesh>
  );
};

export default Line;
