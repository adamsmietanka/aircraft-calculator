import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  useSpring,
  animated,
  useSpringRef,
  a,
} from "@react-spring/three";
import { Line, Text } from "@react-three/drei";
import { NUMBERS_PADDING } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";

interface Props {
  y: number;
  type: string;
  scale: number[];
}
function BasicLine() {
  const ref = useRef<THREE.Line>();

  const starting_position = useMemo(() => {
    return new Float32Array([0, 0, 0, 10, 0, 0]);
  }, []);

  return (
    <animated.line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starting_position.length / 3}
          array={starting_position}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="white" />
    </animated.line>
  );
}

const AnimatedYMarker = ({ y, type, scale }: Props) => {
  const AnimatedLine = a(Line);
  const AnimatedText = animated(Text);

  const { displayMultiplier, valueMultiplier } = useChartUnits(type);

  const markersRef = useSpringRef();
  const titleRef = useSpringRef();

  const [springs, api] = useSpring(
    () => ({
      ref: markersRef,
      position: [0, 0, 0],
      opacity: 1,
    })
  );

  const [opacitySpring, opacityApi] = useSpring(() => ({
    ref: titleRef,
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));

  useEffect(() => {
    api.start({
      position: [0, y * valueMultiplier, 0],
    });
  }, [y, valueMultiplier]);

  return (
    <>
      <animated.mesh position={springs.position}>
        <AnimatedLine
          points={[
            [0, 0, 0],
            [1000, 0, 0],
          ]}
          opacity={springs.opacity}
          lineWidth={1}
          color={"gray"}
        />
        <BasicLine />
        <AnimatedText
          fontSize={0.4}
          position={[-1.5 * NUMBERS_PADDING, 0, 0]}
          scale={[1, 1 / scale[1], 1]}
          color={"grey"}
          fillOpacity={springs.opacity}
        >
          {y * displayMultiplier}
        </AnimatedText>
      </animated.mesh>
    </>
  );
};

export default AnimatedYMarker;
