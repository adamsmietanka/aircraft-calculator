import { useSpring, animated, SpringValue, to } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { FONT_SIZE, NUMBERS_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import AnimatedLine from "./AnimatedLine";

interface Props {
  x: number;
  min: number;
  max: Record<string, number>;
  type: string | undefined;
  scale: number[];
  opacity: SpringValue<number>;
  stepOpacity: SpringValue<number>;
}

const AnimatedVerticalMarker = ({
  x,
  min,
  max,
  type,
  opacity,
  stepOpacity,
  scale,
}: Props) => {
  const { displayMultiplier, valueMultiplier } = useChartUnits(type);
  const { gridColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const [marker] = useSpring(
    () => ({
      position: x * valueMultiplier,
      scale: scale[0],
    }),
    [x, valueMultiplier, scale]
  );

  return (
    <animated.mesh scale={marker.scale.to((scale) => [scale, 1, 1])}>
      <AnimatedText
        fontSize={0.5 * FONT_SIZE}
        position={marker.position.to((x) => [x, min - NUMBERS_PADDING, 0.25])}
        scale={marker.scale.to((scale) => [1 / scale, 1, 1])}
        color={gridColor}
        fillOpacity={to(
          [opacity, stepOpacity],
          (o, stepOpacity) => (x > max.x / scale[0] ? 0 : o) * stepOpacity
        )}
      >
        {x * displayMultiplier}
      </AnimatedText>

      <AnimatedLine
        points={[
          [x * valueMultiplier, min, 0.05],
          [x * valueMultiplier, max.y, 0.05],
        ]}
        width={x === 0 ? 2 : 1}
        color="grid"
        opacity={to(
          [opacity, stepOpacity],
          (o, stepOpacity) => (x > max.x / scale[0] ? 0 : 0.25 * o) * stepOpacity
        )}
      />
    </animated.mesh>
  );
};

export default AnimatedVerticalMarker;
