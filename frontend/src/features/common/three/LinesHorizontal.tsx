import { Text } from "@react-three/drei";
import { FONT_SIZE, TITLE_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import AnimatedHorizontalMarker from "./AnimatedHorizontalMarker";
import {
  SpringValue,
  animated,
  config,
  to,
  useSpring,
  useTrail,
} from "@react-spring/three";
import { Axis } from "./LineChart";
import { useEffect, useRef } from "react";
import { checkVisible } from "./checkVisible";
import { useLocation } from "react-router-dom";
import AnimatedHtml from "./AnimatedHtml";

interface AxisProps {
  show: boolean;
  ticks: number[];
  axis: Axis;
  scale: number[];
  min: number;
  max: Record<string, number>;
  mid: number;
  stepOpacity?: SpringValue<number>;
}

const LinesHorizontal = ({
  show,
  ticks,
  axis,
  scale,
  min,
  max,
  mid,
  stepOpacity = new SpringValue(1),
}: AxisProps) => {
  const AnimatedText = animated(Text);
  const { gridColor } = useCSSColors();

  const meshRef = useRef<THREE.Mesh>(null!);
  const { pathname } = useLocation();

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
      titleApi.start({ opacity: 1, delay: 1600 });
    } else {
      trailApi.start({ opacity: 0, delay: 0 });
      titleApi.start({ opacity: 0, delay: 0 });
    }
  }, [pathname, show]);

  const { unit } = useChartUnits(axis.type as string);

  return (
    <mesh ref={meshRef}>
      {opacityTrail.map((i, index) => (
        <AnimatedHorizontalMarker
          key={index}
          y={ticks[index]}
          min={min}
          max={max}
          type={axis.type}
          opacity={i.opacity}
          stepOpacity={stepOpacity}
          scale={scale}
        />
      ))}
      {axis.symbol ? (
        <AnimatedHtml
          show={show}
          delayVisible={1600}
          position={[min - TITLE_PADDING, mid + 0.25, 0.5]}
        >
          {axis.symbol}
        </AnimatedHtml>
      ) : (
        <AnimatedText
          position={[min - 1.2 * TITLE_PADDING, mid + 1, 0.5]}
          rotation-z={Math.PI / 2}
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

export default LinesHorizontal;
