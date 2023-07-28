import useAxes from "./hooks/useAxes";
import Line from "./Line";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";
import { useCSSColors } from "./config";
import { config, useChain, useSpring, useSpringRef } from "@react-spring/three";
import AnimatedSphere from "./AnimatedSphere";

export interface Axis {
  name: string;
  type?: string;
  min?: number;
  max?: number;
}

export interface Trace {
  name: string;
  points: number[][];
}

export interface Point {
  x: number;
  y: number;
}

export type ChartProps = {
  traces: Trace[];
  xAxis: Axis;
  yAxis: Axis;
  point?: Point;
};

const LineChart = ({ traces, xAxis, yAxis, point }: ChartProps) => {
  const { xTicks, yTicks, scaleX, scaleY, minX, minY, midX, midY } = useAxes(
    traces,
    xAxis,
    yAxis
  );

  const { primaryColor, secondaryColor, accentColor, errorColor } =
    useCSSColors();

  const colors = [primaryColor, "green", "orange"];
  const springRefs = traces.map(() => useSpringRef());

  point && springRefs.push(useSpringRef());
  useChain(springRefs);

  return (
    <mesh position={[-midX, -midY, 0]}>
      <LinesVertical
        axis={xAxis}
        ticks={xTicks}
        scale={scaleX}
        mid={midX}
        min={minY}
      />
      <LinesHorizontal
        axis={yAxis}
        ticks={yTicks}
        scale={scaleY}
        mid={midY}
        min={minX}
      />
      {traces.map((trace, index) => (
        <Line
          key={index}
          trace={trace}
          scale={[scaleX, scaleY, 1]}
          color={colors[index]}
          springRef={springRefs[index]}
        />
      ))}
      {point && (
        <AnimatedSphere
          position={[point.x * scaleX, point.y * scaleY, 0]}
          scale={[0.25, 0.25, 0.25]}
          color={errorColor}
          springRef={springRefs[springRefs.length - 1]}
        />
      )}
    </mesh>
  );
};

export default LineChart;
