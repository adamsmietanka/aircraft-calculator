import { useRef } from "react";
import { animated, useSpring, config } from "@react-spring/three";
import { extend, useFrame } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Object3DNode, MaterialNode } from "@react-three/fiber";
import { useCSSColors } from "./config";
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
}

const Line = ({ trace, scale, color }: TraceProps) => {
  const test = useSpring({
    delay: 1000,
    from: { opacity: 0 },
    to: { opacity: 1 },
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

  const { traceColor } = useCSSColors();

  useFrame(() => {
    const interpolatedPoints = marker.points.get();
    const interpolatedOpacity = test.opacity.get();

    const numberOfPoints =
      Math.ceil(interpolatedOpacity * trace.points.length) * 3;

    if (geometryRef.current && materialRef.current) {
      numberOfPoints > 50 &&
        geometryRef.current.setPoints(
          interpolatedPoints.slice(0, numberOfPoints)
        );
    }
  });

  return (
    <animated.mesh scale={marker.scale}>
      <meshLineGeometry ref={geometryRef} points={[0, 0, 0]} />
      <meshLineMaterial ref={materialRef} lineWidth={0.015} color={color} />
    </animated.mesh>
  );
};

export default Line;
