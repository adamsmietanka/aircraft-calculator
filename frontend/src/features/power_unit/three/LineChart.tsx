import { useRef } from "react";
import useAxes from "./hooks/useAxes";
import { ChartProps } from "./Chart2D";
import { useFrame } from "@react-three/fiber";
import Trace from "./Trace";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";

const LineChart = ({ trace, xAxis, yAxis }: ChartProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const { xTicks, yTicks, scaleY } = useAxes(trace, xAxis, yAxis);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setY(scaleY);
    }
  });
  return (
    <>
      <mesh ref={meshRef} position={[-7.5, -5, 0]}>
        <Trace trace={trace} />
        <LinesVertical ticks={xTicks} axis={xAxis} />
        <LinesHorizontal ticks={yTicks} axis={yAxis} />
      </mesh>
    </>
  );
};

export default LineChart;
