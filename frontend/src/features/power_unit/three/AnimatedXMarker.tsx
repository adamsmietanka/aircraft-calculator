import { useMemo, useRef } from "react";
import { useSpring, animated, SpringValue } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { NUMBERS_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { AdditiveBlending } from "three";
import { useFrame } from "@react-three/fiber";

interface Props {
  x: number;
  type: string;
  scale: number[];
  opacity: SpringValue<number>;
}

const AnimatedXMarker = ({ x, type, opacity, scale }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const { displayMultiplier, valueMultiplier } = useChartUnits(type);
  const { gridColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const position = useMemo(() => {
    return new Float32Array([0, 0, 0, 0, 25, 0]);
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
    position.set([interpolatedX], 0);
    position.set([interpolatedX], 3);

    if (positionRef.current) {
      positionRef.current.set(position);
      positionRef.current.needsUpdate = true;
    }
  });

  return (
    <animated.mesh scale={marker.scale.to((scale) => [scale, 1, 1])}>
      <AnimatedText
        fontSize={0.5}
        position={marker.position.to((x) => [x, -NUMBERS_PADDING, 0])}
        scale={marker.scale.to((scale) => [1 / scale, 1, 1])}
        color={gridColor}
        fillOpacity={opacity}
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
          opacity={opacity.to((o) => o / 2)}
          blending={AdditiveBlending}
        />
      </animated.line>
    </animated.mesh>
  );
};

export default AnimatedXMarker;
