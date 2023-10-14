import { Text } from "@react-three/drei";
import { FONT_SIZE, TITLE_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import {
  useTrail,
  animated,
  useSpring,
  config,
  SpringValue,
  to,
} from "@react-spring/three";
import AnimatedVerticalMarker from "./AnimatedVerticalMarker";
import { Axis } from "./LineChart";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { checkVisible } from "./checkVisible";
import AnimatedHtml from "./AnimatedHtml";

interface AxisProps {
  show: boolean;
  ticks: number[];
  axis: Axis;
  scale: number[];
  min: number;
  max: Record<string, number>;
  mid: number;
  stepOpacity: SpringValue<number>;
}

const LinesVertical = ({
  show,
  ticks,
  axis,
  scale,
  min,
  max,
  mid,
  stepOpacity,
}: AxisProps) => {
  const AnimatedText = animated(Text);
  const { gridColor } = useCSSColors();

  const meshRef = useRef<THREE.Mesh>(null!);
  const location = useLocation();

  const [opacityTrail, trailApi] = useTrail(
    ticks.length,
    () => ({
      opacity: 0,
    }),
    []
  );

  const [title, titleApi] = useSpring(
    () => ({
      opacity: 0,
      config: config.molasses,
    }),
    []
  );

  useEffect(() => {
    const vis = show && checkVisible(meshRef.current);
    if (vis) {
      trailApi.start({ opacity: 1, delay: 800 });
      titleApi.start({ opacity: 1, delay: 1600, config: config.molasses });
    } else {
      trailApi.start({ opacity: 0, delay: 0 });
      titleApi.start({ opacity: 0, delay: 0 });
    }
  }, [location.pathname, show]);

  const { unit } = useChartUnits(axis.type as string);

  return (
    <mesh ref={meshRef}>
      {opacityTrail.map(({ opacity }, index) => (
        <AnimatedVerticalMarker
          key={index}
          x={ticks[index]}
          min={min}
          max={max}
          type={axis.type}
          opacity={opacity}
          stepOpacity={stepOpacity}
          scale={scale}
        />
      ))}

      {axis.symbol ? (
        <AnimatedHtml
          show={show}
          delayVisible={1600}
          position={[mid + 1.5, min - TITLE_PADDING, 0]}
        >
          {axis.symbol}
        </AnimatedHtml>
      ) : (
        <AnimatedText
          position={[mid + 1.5, min - TITLE_PADDING, 0]}
          fontSize={0.6 * FONT_SIZE}
          color={gridColor}
          fillOpacity={to(
            [title.opacity, stepOpacity],
            (opacity, stepOpacity) => opacity * stepOpacity
          )}
        >
          {`${axis.name} ${unit && `[${unit}]`}`}
        </AnimatedText>
      )}
    </mesh>
  );
};

export default LinesVertical;
