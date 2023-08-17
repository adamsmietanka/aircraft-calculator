import { useMemo, useRef } from "react";
import { useSpring, animated, SpringValue, to } from "@react-spring/three";
import { Text } from "@react-three/drei";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { useFrame } from "@react-three/fiber";
import { useCSSColors } from "../../common/three/config";

interface Props {
  length: number;
  scale: SpringValue<number>;
  opacity?: SpringValue<number>;
}

const SCALE_CENTER = 2;

const Scale = ({ length, opacity, scale }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const { displayMultiplier, valueMultiplier } = useChartUnits("altitude");
  const { gridColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const position = useMemo(() => {
    return new Float32Array([0, 0, 0, -0.5, 0, 0]);
  }, []);

  const [marker] = useSpring(
    () => ({
      length,
    }),
    [valueMultiplier, length]
  );

  useFrame(() => {
    const interpolatedLength = marker.length.get();
    const interpolatedScale = scale.get();
    
    position.set(
      [
        -(SCALE_CENTER / interpolatedScale - interpolatedLength / 2),
        0,
        0,
        -(SCALE_CENTER / interpolatedScale + interpolatedLength / 2),
      ],
      0
    );

    if (positionRef.current) {
      positionRef.current.set(position);
      positionRef.current.needsUpdate = true;
    }
  });

  return (
    <animated.mesh>
      <AnimatedText
        fontSize={0.5}
        position={to([marker.length, scale], (length, scale) => [
          -(SCALE_CENTER / scale),
          -0.5 / scale,
          0,
        ])}
        scale={scale.to((scale) => 1 / scale)}
        color={gridColor}
        fillOpacity={opacity}
      >
        {length} m
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
        <lineBasicMaterial
          color={gridColor}
          //   opacity={opacity.to((o) => (y === 0 ? o : o / 3))}
          opacity={1}
          transparent
        />
      </animated.line>
    </animated.mesh>
  );
};

export default Scale;
