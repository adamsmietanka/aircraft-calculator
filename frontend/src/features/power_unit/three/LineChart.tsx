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
  const { xTicks, yTicks, scaleX, scaleY } = useAxes(trace, xAxis, yAxis);
  const { width, height } = useChartSize();

  return (
    <mesh position={[-0.4 * width, -0.5 * height, 0]}>
      <LinesVertical ticks={xTicks} scale={scaleX} axis={xAxis} />
      <LinesHorizontal ticks={yTicks} scale={scaleY} axis={yAxis} />
      <Trace trace={trace} scale={[scaleX, scaleY, 1]} />
    </mesh>
  );
};

export default LineChart;
