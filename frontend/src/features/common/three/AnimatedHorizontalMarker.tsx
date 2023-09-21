import { useSpring, animated, SpringValue, to } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { FONT_SIZE, NUMBERS_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import AnimatedLine from "./AnimatedLine";

interface Props {
  y: number;
  min: number;
  max: Record<string, number>;
  type: string | undefined;
  scale: number[];
  opacity: SpringValue<number>;
  stepOpacity: SpringValue<number>;
}

const AnimatedHorizontalMarker = ({
  y,
  min,
  max,
  type,
  opacity,
  scale,
  stepOpacity,
}: Props) => {
  const { displayMultiplier, valueMultiplier } = useChartUnits(type);
  const { gridColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const [marker] = useSpring(
    () => ({
      position: y * valueMultiplier,
      scale: scale[1],
    }),
    [y, valueMultiplier, scale]
  );

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
      <AnimatedLine
        points={[
          [min, y * valueMultiplier, 0.09],
          [max.x, y * valueMultiplier, 0.09],
        ]}
        width={y === 0 ? 2 : 1}
        color="grid"
        opacity={to(
          [opacity, stepOpacity],
          (o, stepOpacity) => (y > max.y / scale[1] ? 0 : 0.25 * o) * stepOpacity
        )}
      />
    </animated.mesh>
  );
};

export default AnimatedHorizontalMarker;
