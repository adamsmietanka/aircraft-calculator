import { Axis } from "./LineChart";
import { Plane } from "@react-three/drei";
import { StoreApi, UseBoundStore } from "zustand";
import HoverMarker from "./HoverMarker";
import round from "../../../utils/interpolation/round";
import { SpringValue } from "@react-spring/three";
import { useRef } from "react";
import { Mesh } from "three";

export interface SimpleMarkerStore {
  x: number;
  y: number;
  hover: boolean;
  locked: boolean;
  legend?: string;
  set: (value: Partial<SimpleMarkerStore>) => void;
}

export interface SynchronizedXMarkersStore {
  x: number;
  y: number | Record<string, number>;
  hover: boolean;
  locked: boolean;
  legend?: string;
  set: (value: Partial<SynchronizedXMarkersStore>) => void;
}

export interface MarkersStore {
  x: Record<string, number>;
  y: Record<string, number>;
  xHover: number;
  yHover: number;
  hover: boolean;
  locked: string | boolean;
  legend?: string;
  set: (value: Partial<MarkersStore>) => void;
}

interface HoverProps {
  disable: boolean;
  name: string;
  axes: Record<string, Axis>;
  data: Record<string, Record<string, number>>;
  min: Record<string, number>;
  max: Record<string, number>;
  scale: Array<number>;
  step: Record<string, number>;
  store: UseBoundStore<
    StoreApi<SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore>
  >;
  yHover: boolean;
  opacity: SpringValue<number>;
  show: boolean;
}
const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const Hover = ({
  disable,
  name,
  axes,
  data,
  min,
  max,
  scale,
  step,
  store,
  yHover,
  opacity,
  show,
}: HoverProps) => {
  const meshRef = useRef<Mesh>(null!);

  return (
    <mesh ref={meshRef}>
      <Plane
        visible={false}
        args={[(max.x - min.x) / scale[0], (max.y - min.y) / scale[1]]}
        position-x={(min.x + max.x) / (2 * scale[0])}
        position-y={(min.y + max.y) / (2 * scale[1])}
        onPointerMove={(e) => {
          const point = meshRef.current.worldToLocal(e.point);
          const locked = store.getState().locked;
          if (yHover) {
            const y = round(point.y, step.y / 10);
            const clampedY = clamp(y, data.min.y, data.max.y);
            !locked && store.setState({ yHover: clampedY });
          } else {
            const x = round(point.x, step.x / 10);
            const clampedX = clamp(x, data.min.x, data.max.x);
            !locked && store.setState({ xHover: clampedX });
          }
        }}
        onPointerEnter={(e) => !disable && store.setState({ hover: true })}
        onPointerLeave={(e) => !disable && store.setState({ hover: false })}
        onClick={(e) => {
          const oldLocked = store.getState().locked;
          // for charts that have individual locks
          if (typeof oldLocked === "string") {
            !disable &&
              store.setState((state) => ({
                locked: state.locked === "" ? name : "",
              }));
          }
          // for charts sharing a lock
          else {
            !disable && store.setState((state) => ({ locked: !state.locked }));
          }
        }}
      />
      <HoverMarker
        name={name}
        store={store}
        scale={scale}
        step={step}
        axes={axes}
        min={min}
        opacity={opacity}
        show={show}
        disable={disable}
      />
    </mesh>
  );
};

export default Hover;
