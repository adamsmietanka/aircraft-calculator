import useAxes from "./hooks/useAxes";
import Line from "./Line";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";
import { useCSSColors } from "./config";
import { useChain, useSpringRef } from "@react-spring/three";
import AnimatedSphere from "./AnimatedSphere";
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

  const { primaryColor, secondaryColor, accentColor, errorColor } =
    useCSSColors();

  const colors = [primaryColor, "green", "orange"];
  const springRefs = traces.map(() => useSpringRef());

  point && springRefs.push(useSpringRef());
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
      {point && (
        <AnimatedSphere
          position={[point.x * scale[0], point.y * scale[1], 0]}
          scale={[0.25, 0.25, 0.25]}
          color={errorColor}
          springRef={springRefs[springRefs.length - 1]}
        />
      )}
    </mesh>
  );
};

export default LineChart;
