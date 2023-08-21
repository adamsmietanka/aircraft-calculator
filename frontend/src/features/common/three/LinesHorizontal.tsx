import { Text } from "@react-three/drei";
import { FONT_SIZE, TITLE_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import AnimatedYMarker from "./AnimatedYMarker";
import {
  animated,
  config,
  useChain,
  useSpring,
  useSpringRef,
  useTrail,
} from "@react-spring/three";
import { Axis } from "./LineChart";

interface AxisProps {
  ticks: number[];
  axis: Axis;
  scale: number[];
  min: number;
  max: Record<string, number>;
  mid: number;
}

const LinesHorizontal = ({ ticks, axis, scale, min, max, mid }: AxisProps) => {
  const AnimatedText = animated(Text);
  const { gridColor } = useCSSColors();

  const markersRef = useSpringRef();
  const titleRef = useSpringRef();

  const opacityTrail = useTrail(ticks.length, {
    ref: markersRef,
    delay: 500,
    from: { opacity: 0 },
    to: { opacity: 1 },
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
        <AnimatedYMarker
          key={index}
          y={ticks[index]}
          min={min}
          max={max}
          type={axis.type}
          opacity={i.opacity}
          scale={scale}
        />
      ))}
      <AnimatedText
        position={[min - 1.2 * TITLE_PADDING, mid + 1, 0.5]}
        rotation-z={Math.PI / 2}
        fontSize={0.6 * FONT_SIZE}
        color={gridColor}
        fillOpacity={title.opacity}
      >
        {`${axis.name} ${unit && `[${unit}]`}`}
      </AnimatedText>
    </>
  );
};

export default LinesHorizontal;
