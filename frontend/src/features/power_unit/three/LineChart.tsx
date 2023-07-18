import useAxes from "./hooks/useAxes";
import Trace from "./Trace";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";
import useChartSize from "./hooks/useChartSize";

export interface Axis {
  name: string;
  type?: string;
  min?: number;
  max?: number;
}

export type ChartProps = {
  trace: number[][];
  xAxis: Axis;
  yAxis: Axis;
};

const LineChart = ({ trace, xAxis, yAxis }: ChartProps) => {
  const { xTicks, yTicks, scaleX, scaleY, minX, minY, midX, midY } = useAxes(
    trace,
    xAxis,
    yAxis
  );

  return (
    <mesh position={[-0.9 * midX, -0.9 * midY, 0]}>
      <LinesVertical
        ticks={xTicks}
        scale={scaleX}
        mid={midX}
        axis={xAxis}
        min={minY}
      />
      <LinesHorizontal
        ticks={yTicks}
        scale={scaleY}
        mid={midY}
        axis={yAxis}
        min={minX}
      />
      <Trace trace={trace} scale={[scaleX, scaleY, 1]} />
    </mesh>
  );
};

export default LineChart;
