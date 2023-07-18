import useAxes from "./hooks/useAxes";
import Line from "./Line";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";
import { useCSSColors } from "./config";
import { useChain, useSpringRef } from "@react-spring/three";

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

export type ChartProps = {
  traces: Trace[];
  xAxis: Axis;
  yAxis: Axis;
};

const LineChart = ({ traces, xAxis, yAxis }: ChartProps) => {
  const { xTicks, yTicks, scaleX, scaleY, minX, minY, midX, midY } = useAxes(
    traces,
    xAxis,
    yAxis
  );

  const { primaryColor, secondaryColor, accentColor } = useCSSColors();

  const colors = [primaryColor, "green", "orange"];
  const springRefs = traces.map(() => useSpringRef());
  useChain(springRefs);

  return (
    <mesh position={[-0.9 * midX, -0.9 * midY, 0]}>
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
    </mesh>
  );
};

export default LineChart;
