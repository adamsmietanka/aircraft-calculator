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
  xAxis: Axis;
  yAxis: Axis;
  point?: Point;
  store?: UseBoundStore<StoreApi<ChartStore>>;
};

const LineChart = ({ traces, xAxis, yAxis, point, store }: ChartProps) => {
  const { xTicks, yTicks, scaleX, scaleY, minX, minY, midX, midY } = useAxes(
    traces,
    xAxis,
    yAxis
  );

  const { primaryColor, secondaryColor, accentColor, errorColor } =
    useCSSColors();

  const colors = [primaryColor, "green", "orange"];
  const springRefs = traces.map(() => useSpringRef());

  point && springRefs.push(useSpringRef());
  useChain(springRefs);

  return (
    <mesh position={[-midX, -midY, 0]}>
      <Plane
        args={[200, 200]}
        position-x={100 + minX}
        position-y={100 + minY}
        material-transparent
        material-opacity={0}
        onPointerMove={(e) => {
          const x = (e.point.x + midX) / scaleX;
          const min = minX / scaleX;
          const locked = store && store.getState().locked;

          !locked &&
            min <= x &&
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
        axis={xAxis}
        ticks={xTicks}
        scale={scaleX}
        mid={midX}
        min={minY}
      />
      <LinesHorizontal
        axis={yAxis}
        ticks={yTicks}
        scale={scaleY}
        mid={midY}
        min={minX}
      />
      {traces.map((trace, index) => (
        <Line
          key={index}
          trace={trace}
          scale={[scaleX, scaleY, 1]}
          color={colors[index]}
          springRef={springRefs[index]}
        />
      ))}
      {store && (
        <HoverMarker
          store={store}
          scale={[scaleX, scaleY, 1]}
          type={yAxis.type}
        />
      )}
      {point && (
        <AnimatedSphere
          position={[point.x * scaleX, point.y * scaleY, 0]}
          scale={[0.25, 0.25, 0.25]}
          color={errorColor}
          springRef={springRefs[springRefs.length - 1]}
        />
      )}
    </mesh>
  );
};

export default LineChart;
