import { Canvas, ThreeElements } from "@react-three/fiber";
import Trace from "./Trace";
import LinesVertical from "./LinesVertical";
import useAxisTicks from "./hooks/useAxisTicks";
import LinesHorizontal from "./LinesHorizontal";

export interface Point {
  x: number;
  y: number;
}

export interface Axis {
  name: string;
  type?: string;
  min?: number;
  max?: number;
}

export type ChartProps = {
  trace: Point[];
  xAxis: Axis;
  yAxis: Axis;
} & ThreeElements["mesh"];

export type TraceProps = {
  trace: Point[];
  scale: number[];
};

const Chart2D = ({ trace, xAxis, yAxis, ...props }: ChartProps) => {
  const { xTicks, yTicks, scaleY } = useAxisTicks(trace, xAxis, yAxis);
  return (
    <div className="h-4/5 w-3/5">
      <Canvas orthographic camera={{ zoom: 30, position: [0, 0, 10] }}>
        <mesh position={[-7.5, -5, 0]}>
          <Trace trace={trace} scale={[1, scaleY, 1]} {...props} />
          <LinesVertical ticks={xTicks} axis={xAxis} />
          <LinesHorizontal ticks={yTicks} scale={scaleY} axis={yAxis} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Chart2D;
