import { Text } from "@react-three/drei";
import { TITLE_PADDING, useCSSColors } from "./config";
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
import useChartSize from "./hooks/useChartSize";
import { Axis } from "./LineChart";

interface AxisProps {
  ticks: number[];
  axis: Axis;
  scale: number;
}

const LinesHorizontal = ({ ticks, axis, scale }: AxisProps) => {
  const AnimatedText = animated(Text);
  const { gridColor } = useCSSColors();
  const { height } = useChartSize();

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

  const { displayMultiplier, valueMultiplier, unit } = useChartUnits(
    axis.type as string
  );

  return (
    <mesh>
      {opacityTrail.map((i, index) => (
        <AnimatedYMarker
          key={index}
          y={ticks[index]}
          type="power"
          opacity={i.opacity}
          scale={[scale]}
        />
      ))}
      <AnimatedText
        position={[-2 * TITLE_PADDING, height / 2, 0]}
        fontSize={0.6}
        color={gridColor}
        fillOpacity={title.opacity}
      >
        {`${axis.name} [${unit}]`}
      </AnimatedText>
    </mesh>
  );
};

export default LinesHorizontal;
