import { Text } from "@react-three/drei";
import { FONT_SIZE, TITLE_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import {
  useTrail,
  animated,
  useSpringRef,
  useSpring,
  useChain,
  config,
} from "@react-spring/three";
import AnimatedXMarker from "./AnimatedXMarker";
import { Axis } from "./LineChart";

interface AxisProps {
  ticks: number[];
  axis: Axis;
  scale: number[];
  min: number;
  max: Record<string, number>;
  mid: number;
}

const LinesVertical = ({ ticks, axis, scale, min, max, mid }: AxisProps) => {
  const AnimatedText = animated(Text);
  const { gridColor } = useCSSColors();

  const markersRef = useSpringRef();
  const titleRef = useSpringRef();

  const opacityTrail = useTrail(ticks.length, {
    ref: markersRef,
    delay: 500,
    from: { opacity: 0 },
    to: { opacity: 1 },
    opacity: 0,
  });

  const title = useSpring({
    ref: titleRef,
    delay: 500,
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  });

  useChain([markersRef, titleRef]);

  const { unit } = useChartUnits(axis.type as string);

  return (
    <>
      {opacityTrail.map((i, index) => (
        <AnimatedXMarker
          key={index}
          x={ticks[index]}
          min={min}
          max={max}
          type={axis.type}
          opacity={i.opacity}
          scale={scale}
        />
      ))}
      <AnimatedText
        position={[mid + 1.5, min - TITLE_PADDING, 0]}
        fontSize={0.6 * FONT_SIZE}
        color={gridColor}
        fillOpacity={title.opacity}
      >
        {`${axis.name} ${unit && `[${unit}]`}`}
      </AnimatedText>
    </>
  );
};

export default LinesVertical;
