import { SpringRef, animated, config, useSpring } from "@react-spring/three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { reynolds } from "../data/profiles";
import { useWingStore } from "../stores/useWing";
import { useCSSColors } from "../../common/three/config";

interface TraceProps {
  points: number[][];
  positionY: number;
  show: boolean;
}

const AirStream = ({ points, positionY, show }: TraceProps) => {
  const profile = useWingStore((state) => state.profile);
  const reynoldsIndex = useWingStore((state) => state.reynolds);

  const speed = reynolds[profile][reynoldsIndex];

  const [marker] = useSpring(
    () => ({
      points: points.flat(),
      opacity: show ? 1 : 0,
    }),
    [points, show]
  );

  const geometryRef = useRef<MeshLineGeometry>(null);
  const materialRef = useRef<MeshLineMaterial>(null);

  const { gridColor } = useCSSColors();

  useFrame(() => {
    const interpolatedPoints = marker.points.get();
    const interpolatedOpacity = marker.opacity.get();

    if (geometryRef.current && materialRef.current) {
      materialRef.current.dashOffset -= speed / 1000;
      materialRef.current.opacity = 0.2 * interpolatedOpacity;
      geometryRef.current.setPoints(interpolatedPoints);
    }
  });

  return (
    <animated.mesh scale={[1.2, 1.2, 1]} position-y={positionY}>
      <meshLineGeometry ref={geometryRef} points={[0, 0, 0]} />
      <meshLineMaterial
        ref={materialRef}
        dashArray={0.05}
        dashOffset={1}
        dashRatio={0.5}
        transparent
        lineWidth={0.015}
        color={gridColor}
        opacity={0.1}
      />
    </animated.mesh>
  );
};

export default AirStream;
