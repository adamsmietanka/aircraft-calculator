import { useMemo, useRef } from "react";
import { useSpring, animated, SpringValue } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { NUMBERS_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { useFrame } from "@react-three/fiber";

interface Props {
  y: number;
  type: string | undefined;
  scale: number[];
  opacity: SpringValue<number>;
}

const AnimatedYMarker = ({ y, type, opacity, scale }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const { displayMultiplier, valueMultiplier } = useChartUnits(type);
  const { gridColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const position = useMemo(() => {
    return new Float32Array([0, 0, 0, 200, 0, 0]);
  }, []);

  const [marker] = useSpring(
    () => ({
      position: y * valueMultiplier,
      scale: scale[0],
    }),
    [y, valueMultiplier, scale]
  );

  useFrame(() => {
    const interpolatedY = marker.position.get();
    position.set([interpolatedY], 1);
    position.set([interpolatedY], 4);

    if (positionRef.current) {
      positionRef.current.set(position);
      positionRef.current.needsUpdate = true;
    }
  });

  return (
    <animated.mesh scale={marker.scale.to((scale) => [1, scale, 1])}>
      <AnimatedText
        fontSize={0.5}
        position={marker.position.to((y) => [-1.5 * NUMBERS_PADDING, y, 0])}
        scale={marker.scale.to((scale) => [1, 1 / scale, 1])}
        color={gridColor}
        fillOpacity={opacity}
      >
        {y > 1 || y === 0
          ? y * displayMultiplier
          : (y * displayMultiplier).toFixed(3)}
      </AnimatedText>
      <animated.line>
        <bufferGeometry>
          <bufferAttribute
            ref={positionRef}
            attach="attributes-position"
            count={position.length / 3}
            array={position}
            itemSize={3}
          />
        </bufferGeometry>
        <animated.lineBasicMaterial
          color={gridColor}
          opacity={opacity.to((o) => o / 2)}
          transparent
        />
      </animated.line>
    </animated.mesh>
  );
};

export default AnimatedYMarker;
