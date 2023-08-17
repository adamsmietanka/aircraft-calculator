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
import { Axis } from "./LineChart";

interface AxisProps {
  ticks: number[];
  axis: Axis;
  scale: number;
  min: number;
  mid: number;
}

const LinesHorizontal = ({ ticks, axis, scale, min, mid }: AxisProps) => {
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
    <mesh position={[min, 0, 0]}>
      {opacityTrail.map((i, index) => (
        <AnimatedYMarker
          key={index}
          y={ticks[index]}
          type={axis.type}
          opacity={i.opacity}
          scale={[scale]}
        />
      ))}
      <AnimatedText
        position={[-1.2 * TITLE_PADDING, mid + 1, 0]}
        rotation-z={Math.PI / 2}
        fontSize={0.6}
        color={gridColor}
        fillOpacity={title.opacity}
      >
        {`${axis.name} ${unit && `[${unit}]`}`}
      </AnimatedText>
    </mesh>
  );
};

export default LinesHorizontal;
