import { useMemo, useRef } from "react";
import { useSpring, animated, SpringValue } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { NUMBERS_PADDING } from "./config";
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
  const AnimatedText = animated(Text);

  const position = useMemo(() => {
    return new Float32Array([0, 0, 0, 0, 15, 0]);
  }, []);

  const [marker] = useSpring(
    () => ({
    //   from: {
    //     position: 0,
    //     scale: scale[0],
    //   },
    //   to: { position: 5, scale: scale[0] },
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
        fontSize={0.4}
        position={marker.position.to((x) => [x, -NUMBERS_PADDING, 0])}
        scale={marker.scale.to((scale) => [1 / scale, 1, 1])}
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
          color="white"
          opacity={opacity}
          blending={AdditiveBlending}
        />
      </animated.line>
    </animated.mesh>
  );
};

export default AnimatedXMarker;
