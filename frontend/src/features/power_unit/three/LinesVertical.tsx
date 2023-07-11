import { Text } from "@react-three/drei";
import { TITLE_PADDING } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { Axis } from "./Chart2D";
import {
  useTrail,
  animated,
  useSpringRef,
  useSpring,
  useChain,
  useSprings,
  config,
} from "@react-spring/three";
import AnimatedXMarker from "./AnimatedXMarker";

interface AxisProps {
  ticks: number[];
  axis: Axis;
  scale: number;
}

const LinesVertical = ({ ticks, axis, scale, ...props }: AxisProps) => {
  const AnimatedText = animated(Text);

  const markersRef = useSpringRef();
  const titleRef = useSpringRef();

  const [opacityTrail] = useTrail(
    ticks.length,
    () => ({
      ref: markersRef,
      delay: 500,
      from: { opacity: 0 },
      to: { opacity: 1 },
    }),
    []
  );

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
    <mesh {...props}>
      {opacityTrail.map((i, index) => (
        <AnimatedXMarker
          key={index}
          x={ticks[index]}
          type="altitude"
          opacity={i.opacity}
          scale={[scale]}
        />
      ))}
      <AnimatedText
        position={[9, -TITLE_PADDING, 0]}
        fontSize={0.6}
        fillOpacity={title.opacity}
      >
        {`${axis.name} [${unit}]`}
      </AnimatedText>
    </mesh>
  );
};

export default LinesVertical;
