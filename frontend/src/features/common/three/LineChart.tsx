import useAxes from "./hooks/useAxes";
import Line from "./Line";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";
import { useChain, useSpringRef } from "@react-spring/three";
import { StoreApi, UseBoundStore } from "zustand";
import Hover, {
  MarkersStore,
  SimpleMarkerStore,
  SynchronizedXMarkersStore,
} from "./Hover";

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
  name: string;
  traces: Trace[];
  axes: Record<string, Axis>;
  point?: Point;
  store?: UseBoundStore<
    StoreApi<SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore>
  >;
  yHover?: boolean;
};

const LineChart = ({
  name,
  traces,
  axes,
  point,
  store,
  yHover = false,
}: ChartProps) => {
  const { ticks, scale, min, mid, step } = useAxes(traces, axes);

  const colors = ["primary", "green", "orange"];
  const springRefs = traces.map(() => useSpringRef());

  useChain(springRefs);

  return (
    <mesh position={[-mid.x, -mid.y, 0]}>
      <LinesVertical
        axis={axes.x}
        ticks={ticks.x}
        scale={scale[0]}
        mid={mid.x}
        min={min.y}
      />
      <LinesHorizontal
        axis={axes.y}
        ticks={ticks.y}
        scale={scale[1]}
        mid={mid.y}
        min={min.x}
      />
      {traces.map((trace, index) => (
        <Line
          key={index}
          trace={trace}
          scale={scale}
          color={colors[index]}
          springRef={springRefs[index]}
        />
      ))}
      {store && (
        <Hover
          name={name}
          axes={axes}
          min={min}
          mid={mid}
          scale={scale}
          step={step}
          store={store}
          yHover={yHover}
        />
      )}
    </mesh>
  );
};

export default LineChart;
