import useAxes from "./hooks/useAxes";
import Line from "./Line";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";
import { useCSSColors } from "./config";
import { config, useChain, useSpring, useSpringRef } from "@react-spring/three";
import AnimatedSphere from "./AnimatedSphere";
import { Plane } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import {
  findUpperBound,
  linearInterpolation,
} from "../../../utils/interpolation/binarySearch";
import { ChartStore } from "../PowerUnitEngine";
import { StoreApi, UseBoundStore } from "zustand";
import { useThree } from "@react-three/fiber";
import HoverMarker from "../../common/three/HoverMarker";

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
  traces: Trace[];
  axes: Record<string, Axis>;
  point?: Point;
  store?: UseBoundStore<StoreApi<ChartStore>>;
};

const LineChart = ({ traces, axes, point, store }: ChartProps) => {
  const { ticks, scale, min, mid, step } = useAxes(traces, axes);

  const { primaryColor, secondaryColor, accentColor, errorColor } =
    useCSSColors();

  const colors = [primaryColor, "green", "orange"];
  const springRefs = traces.map(() => useSpringRef());

  point && springRefs.push(useSpringRef());
  useChain(springRefs);

  return (
    <mesh position={[-mid.x, -mid.y, 0]}>
      <Plane
        args={[200, 200]}
        position-x={100 + min.x}
        position-y={100 + min.y}
        material-transparent
        material-opacity={0}
        onPointerMove={(e) => {
          const x = (e.point.x + mid.x) / scale[0];
          const minX = min.x / scale[0];
          const locked = store && store.getState().locked;

          !locked &&
            minX <= x &&
            store &&
            store.setState({ x: parseFloat(x.toPrecision(3)) });
        }}
        onPointerEnter={(e) => {
          store && store.setState({ hover: true });
        }}
        onPointerLeave={(e) => {
          store && store.setState({ hover: false });
        }}
        onClick={(e) => {
          store && store.setState((state) => ({ locked: !state.locked }));
        }}
      />
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
        <HoverMarker
          store={store}
          scale={scale}
          step={step}
          axes={axes}
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
