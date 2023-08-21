import { useMemo, useRef } from "react";
import { useSpring, animated, SpringValue, to } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { FONT_SIZE, NUMBERS_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { useFrame } from "@react-three/fiber";

interface Props {
  x: number;
  min: number;
  max: Record<string, number>;
  type: string | undefined;
  scale: number[];
  opacity: SpringValue<number>;
}

const AnimatedXMarker = ({ x, min, max, type, opacity, scale }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const { displayMultiplier, valueMultiplier } = useChartUnits(type);
  const { gridColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const position = useMemo(() => {
    return new Float32Array([0, 0, 0, 0, 50, 0]);
  }, []);

  const [marker] = useSpring(
    () => ({
      position: x * valueMultiplier,
      scale: scale[0],
    }),
    [x, valueMultiplier, scale]
  );

  useFrame(() => {
    const interpolatedX = marker.position.get();
    position.set([interpolatedX, min, 0], 0);
    position.set([interpolatedX, max.y, 0], 3);

    if (positionRef.current) {
      positionRef.current.set(position);
      positionRef.current.needsUpdate = true;
    }
  });

  return (
    <animated.mesh scale={marker.scale.to((scale) => [scale, 1, 1])}>
      <AnimatedText
        fontSize={0.5 * FONT_SIZE}
        position={marker.position.to((x) => [x, min - NUMBERS_PADDING, 0.25])}
        scale={marker.scale.to((scale) => [1 / scale, 1, 1])}
        color={gridColor}
        fillOpacity={opacity.to((o) => (x <= max.x / scale[0] ? o : 0))}
      >
        {x * displayMultiplier}
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
          opacity={opacity.to((o) =>
            x > max.x / scale[0] ? 0 : x === 0 ? o : o / 3
          )}
          transparent
        />
      </animated.line>
    </animated.mesh>
  );
};

export default AnimatedXMarker;
