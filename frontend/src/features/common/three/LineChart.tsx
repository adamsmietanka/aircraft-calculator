import useAxes from "./hooks/useAxes";
import LinesVertical from "./LinesVertical";
import LinesHorizontal from "./LinesHorizontal";
import { SpringValue, animated, useSpring } from "@react-spring/three";
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
  symbol?: React.ReactNode;
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
  show?: boolean;
  disableHover?: boolean;
  name: string;
  traces: Trace[];
  axes: Record<string, Axis>;
  point?: Point;
  store?: UseBoundStore<
    StoreApi<SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore>
  >;
  yHover?: boolean;
  width: number;
  height?: number;
  gridPositionX?: number;
  opacity?: SpringValue<number>;
};

const LineChart = ({
  show = true,
  disableHover = false,
  name,
  traces,
  axes,
  store,
  yHover = false,
  width = 1,
  height = 1,
  gridPositionX = 0,
  opacity = new SpringValue(1),
}: ChartProps) => {
  const { ticks, scale, data, min, max, mid, step } = useAxes(
    traces,
    axes,
    width,
    height
  );

  const colors = ["primary", "green", "orange", "secondary"];

  const [chartSpring] = useSpring(
    () => ({
      scaleX: scale[0],
      scaleY: scale[1],
    }),
    [scale]
  );

  return (
    <mesh position-x={(gridPositionX * CANVAS_WIDTH) / 2}>
      <mesh position={[-mid.x, -mid.y, 0]}>
        <LinesVertical
          show={show}
          axis={axes.x}
          ticks={ticks.x}
          scale={scale}
          scaleX={chartSpring.scaleX}
          scaleY={chartSpring.scaleY}
          mid={mid.x}
          min={min}
          max={max}
          height={height}
          stepOpacity={opacity}
        />
        <LinesHorizontal
          show={show}
          axis={axes.y}
          ticks={ticks.y}
          scale={scale}
          mid={mid.y}
          min={min}
          max={max}
          width={width}
          stepOpacity={opacity}
        />
        <animated.mesh
          scale-x={chartSpring.scaleX}
          scale-y={chartSpring.scaleY}
        >
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
              disable={disableHover}
              name={name}
              axes={axes}
              data={data}
              min={min}
              max={max}
              scale={scale}
              step={step}
              store={store}
              yHover={yHover}
              opacity={opacity}
              show={show}
            />
          )}
        </animated.mesh>
      </mesh>
    </mesh>
  );
};

export default LineChart;
