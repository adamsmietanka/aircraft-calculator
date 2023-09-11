import { useMemo, useRef } from "react";
import { useSpring, animated, SpringValue, to } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { FONT_SIZE, NUMBERS_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { useFrame } from "@react-three/fiber";

interface Props {
  y: number;
  min: number;
  max: Record<string, number>;
  type: string | undefined;
  scale: number[];
  opacity: SpringValue<number>;
  stepOpacity: SpringValue<number>;
}

const AnimatedYMarker = ({
  y,
  min,
  max,
  type,
  opacity,
  scale,
  stepOpacity,
}: Props) => {
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
      scale: scale[1],
    }),
    [y, valueMultiplier, scale]
  );

  useFrame(() => {
    const interpolatedY = marker.position.get();
    position.set([min, interpolatedY, 0], 0);
    position.set([max.x, interpolatedY, 0], 3);

    if (positionRef.current) {
      positionRef.current.set(position);
      positionRef.current.needsUpdate = true;
    }
  });

  return (
    <animated.mesh scale={marker.scale.to((scale) => [1, scale, 1])}>
      <AnimatedText
        fontSize={0.5 * FONT_SIZE}
        position={marker.position.to((y) => [
          min - 1.5 * NUMBERS_PADDING,
          y,
          0.25,
        ])}
        scale={marker.scale.to((scale) => [1, 1 / scale, 1])}
        color={gridColor}
        fillOpacity={to(
          [opacity, stepOpacity],
          (o, stepOpacity) => (y > max.y / scale[1] ? 0 : o) * stepOpacity
        )}
      >
        {y * displayMultiplier}
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
          opacity={to(
            [opacity, stepOpacity],
            (o, stepOpacity) =>
              (y > max.y / scale[1] ? 0 : y === 0 ? o : o / 3) * stepOpacity
          )}
          transparent
        />
      </animated.line>
    </animated.mesh>
  );
};

export default AnimatedYMarker;
