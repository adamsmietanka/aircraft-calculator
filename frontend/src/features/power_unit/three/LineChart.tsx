import useAxes from "./hooks/useAxes";
import { ChartProps } from "./Chart2D";
import Trace from "./Trace";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";
import useChartSize from "./hooks/useChartSize";

const LineChart = ({ trace, xAxis, yAxis }: ChartProps) => {
  const { xTicks, yTicks, scaleX, scaleY } = useAxes(trace, xAxis, yAxis);
  const { width, height } = useChartSize();

  return (
    <mesh position={[-0.4 * width, -0.5 * height, 0]}>
      <Trace trace={trace} scale={[scaleX, scaleY, 1]} />
      <LinesVertical ticks={xTicks} scale={scaleX} axis={xAxis} />
      <LinesHorizontal ticks={yTicks} scale={scaleY} axis={yAxis} />
    </mesh>
  );
};

export default LineChart;
