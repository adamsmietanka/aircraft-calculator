import { useMemo, useRef } from "react";
import { useSpring, animated, SpringValue, config } from "@react-spring/three";
import { Text } from "@react-three/drei";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { useFrame } from "@react-three/fiber";
import { useCSSColors } from "../../common/three/config";

interface Props {
  length: number;
  scale: SpringValue<number>;
  opacity: SpringValue<number>;
}

const SCALE_CENTER = 2.5;
const SCALE_SIDE_HEIGHT = 0.2;

const Scale = ({ length, scale, opacity }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);

  const { displayMultiplier, valueMultiplier, unit } = useChartUnits("length");
  const { gridColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const [marker] = useSpring(
    () => ({
      length: length * valueMultiplier,
    }),
    [valueMultiplier, length]
  );

  const position = useMemo(() => {
    return new Float32Array(3 * 6);
  }, []);

  useFrame(() => {
    const interpolatedLength = marker.length.get();
    const interpolatedScale = scale.get();

    const xStart = -(SCALE_CENTER / interpolatedScale - interpolatedLength / 2);
    const xEnd = -(SCALE_CENTER / interpolatedScale + interpolatedLength / 2);
    const y = SCALE_SIDE_HEIGHT / interpolatedScale;

    position.set([xStart, 0, 0, xEnd, 0, 0], 0);

    //left side
    position.set([xEnd, y, 0, xEnd, -y, 0], 6);

    //right side
    position.set([xStart, y, 0, xStart, -y, 0], 12);

    if (positionRef.current) {
      positionRef.current.set(position);
      positionRef.current.needsUpdate = true;
    }
  });

  return (
    <animated.mesh>
      <AnimatedText
        fontSize={0.5}
        position={scale.to((scale) => [
          -(SCALE_CENTER / scale),
          -0.5 / scale,
          0,
        ])}
        scale={scale.to((scale) => 1 / scale)}
        color={gridColor}
        fillOpacity={opacity}
      >
        {length * displayMultiplier} {unit}
      </AnimatedText>
      <animated.lineSegments>
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
          opacity={opacity.to((o) => o)}
          transparent
        />
      </animated.lineSegments>
    </animated.mesh>
  );
};

export default Scale;
