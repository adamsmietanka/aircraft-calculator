import useAxes from "./hooks/useAxes";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";
import { SpringValue, useChain, useSpringRef } from "@react-spring/three";
import { StoreApi, UseBoundStore } from "zustand";
import Hover, {
  MarkersStore,
  SimpleMarkerStore,
  SynchronizedXMarkersStore,
} from "./Hover";
import { CANVAS_WIDTH } from "./config";
import AnimatedLine from "./AnimatedLine";

export interface Axis {
  name: string;
  type?: string;
  min?: number;
  max?: number;
}

export interface Trace {
  name: string;
  points: number[][];
  style?: string;
}

export interface Point {
  x: number;
  y: number;
}

export type ChartProps = {
  name: string;
  traces: Trace[];
  axes: Record<string, Axis>;
  point?: Point;
  store?: UseBoundStore<
    StoreApi<SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore>
  >;
  yHover?: boolean;
  zHover?: boolean;
  width: number;
  gridPositionX?: number;
  opacity?: SpringValue<number>;
};

const LineChart = ({
  name,
  traces,
  axes,
  store,
  yHover = false,
  zHover = false,
  width = 1,
  gridPositionX = 0,
  opacity = new SpringValue(1),
}: ChartProps) => {
  const { ticks, scale, min, max, mid, step } = useAxes(traces, axes, width);

  const colors = ["primary", "green", "orange", "secondary"];
  const springRefs = traces.map(() => useSpringRef());

  useChain(springRefs);

  return (
    <mesh position-x={(gridPositionX * CANVAS_WIDTH) / 2}>
      <mesh position={[-mid.x, -mid.y, 0]}>
        <LinesVertical
          axis={axes.x}
          ticks={ticks.x}
          scale={scale}
          mid={mid.x}
          min={min.y}
          max={max}
          stepOpacity={opacity}
        />
        <LinesHorizontal
          axis={axes.y}
          ticks={ticks.y}
          scale={scale}
          mid={mid.y}
          min={min.x}
          max={max}
          stepOpacity={opacity}
        />
        {traces.map((trace, index) => (
          <AnimatedLine
            key={index}
            points={trace.points}
            scale={scale}
            color={trace.style ? "primary" : colors[index]}
            style={trace.style}
            opacity={opacity}
          />
        ))}
        {store && (
          <Hover
            name={name}
            axes={axes}
            min={min}
            max={max}
            mid={mid}
            scale={scale}
            step={step}
            store={store}
            yHover={yHover}
            zHover={zHover}
            opacity={opacity}
          />
        )}
      </mesh>
    </mesh>
  );
};

export default LineChart;
