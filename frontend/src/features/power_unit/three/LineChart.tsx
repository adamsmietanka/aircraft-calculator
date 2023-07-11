import { useRef } from "react";
import useAxes from "./hooks/useAxes";
import { ChartProps } from "./Chart2D";
import { useFrame } from "@react-three/fiber";
import Trace from "./Trace";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";

const LineChart = ({ trace, xAxis, yAxis }: ChartProps) => {

  const { xTicks, yTicks, scaleX, scaleY } = useAxes(trace, xAxis, yAxis);

  return (
    <>
      <mesh position={[-7.5, -5, 0]}>
        <Trace trace={trace} scale={[scaleX, scaleY, 1]} />
        <LinesVertical ticks={xTicks} scale={scaleX} axis={xAxis} />
        <LinesHorizontal ticks={yTicks} scale={scaleY} axis={yAxis} />
      </mesh>
    </>
  );
};

export default LineChart;
