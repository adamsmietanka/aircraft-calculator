import { useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import { Line, Text } from "@react-three/drei";
import { NUMBERS_PADDING } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";

interface Props {
  y: number;
  type: string;
  scale: number[];
}

const AnimatedMarker = ({ y, type, scale }: Props) => {
  const AnimatedLine = animated(Line);
  const AnimatedText = animated(Text);

  const { displayMultiplier, valueMultiplier, unit } = useChartUnits(type);

  const [springs, api] = useSpring(
    () => ({
      position: [0, 0, 0],
      opacity: 1,
    }),
    []
  );

  useEffect(() => {
    api.start({
      position: [0, y * valueMultiplier, 0],
    });
  }, [y, valueMultiplier]);

  return (
    <animated.mesh position={springs.position}>
      <AnimatedLine
        points={[
          [0, 0, 0],
          [1000, 0, 0],
        ]}
        opacity={springs.opacity}
        lineWidth={2}
        color={"gray"}
      />
      <AnimatedText
        fontSize={0.4}
        position={[-1.5 * NUMBERS_PADDING, 0, 0]}
        scale={[1, 1 / scale[1], 1]}
        fillOpacity={springs.opacity}
      >
        {y * displayMultiplier}
      </AnimatedText>
    </animated.mesh>
  );
};

export default AnimatedMarker;
