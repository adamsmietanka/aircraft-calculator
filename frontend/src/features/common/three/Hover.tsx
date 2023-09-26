import { Axis } from "./LineChart";
import { Plane } from "@react-three/drei";
import { StoreApi, UseBoundStore } from "zustand";
import HoverMarker from "./HoverMarker";
import round from "../../../utils/interpolation/round";
import { SpringValue } from "@react-spring/three";

export interface SimpleMarkerStore {
  x: number;
  y: number;
  hover: boolean;
  show: boolean;
  locked: boolean;
  set: (value: Partial<SimpleMarkerStore>) => void;
}

export interface SynchronizedXMarkersStore {
  x: number;
  y: number | Record<string, number>;
  hover: boolean | Record<string, boolean>;
  show: boolean;
  locked: boolean;
  set: (value: Partial<SynchronizedXMarkersStore>) => void;
}

export interface MarkersStore {
  x: Record<string, number>;
  y: Record<string, number>;
  hover: Record<string, boolean>;
  show: boolean;
  locked: string | boolean;
  set: (value: Partial<MarkersStore>) => void;
}

interface HoverProps {
  name: string;
  axes: Record<string, Axis>;
  min: Record<string, number>;
  max: Record<string, number>;
  mid: Record<string, number>;
  scale: Array<number>;
  step: Record<string, number>;
  store: UseBoundStore<
    StoreApi<SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore>
  >;
  yHover: boolean;
  zHover: boolean;
  opacity: SpringValue<number>;
}

const Hover = ({
  name,
  axes,
  min,
  max,
  mid,
  scale,
  step,
  store,
  yHover,
  zHover,
  opacity,
}: HoverProps) => {
  return (
    <>
      <Plane
        visible={false}
        args={[max.x - min.x, max.y - min.y]}
        position-x={(min.x + max.x) / 2}
        position-y={(min.y + max.y) / 2}
        material-transparent
        material-opacity={0}
        onPointerMove={(e) => {
          if (yHover || zHover) {
            const y = round(
              ((yHover ? e.point.y : -e.point.z) + mid.y) / scale[1],
              step.y / 10
            );
            const locked = store.getState().locked;
            const oldY = store.getState().y;

            if (!locked) {
              if (typeof oldY === "number") {
                store.setState({ y });
              } else {
                store.setState({ y: { ...oldY, [name]: y } });
              }
            }
          } else {
            const gridPositionFix = e.object.parent?.parent?.position.x || 0;
            const x = round(
              (e.point.x + mid.x - gridPositionFix) / scale[0],
              step.x / 10
            );
            const locked = store.getState().locked;
            const oldX = store.getState().x;

            if (!locked) {
              if (typeof oldX === "number") {
                store.setState({ x });
              } else {
                store.setState({ x: { ...oldX, [name]: x } });
              }
            }
          }
        }}
        onPointerEnter={(e) => {
          const oldHover = store.getState().hover;
          if (typeof oldHover === "boolean") {
            store.setState({ hover: true, show: true });
          } else {
            store.setState({
              hover: { ...oldHover, [name]: true },
              show: true,
            });
          }
        }}
        onPointerLeave={(e) => {
          const oldHover = store.getState().hover;
          if (typeof oldHover === "boolean") {
            store.setState({ hover: false, show: false });
          } else {
            store.setState({
              hover: { ...oldHover, [name]: false },
              show: false,
            });
          }
        }}
        onClick={(e) => {
          const oldLocked = store.getState().locked;
          // for charts that have individual locks
          if (typeof oldLocked === "string") {
            store.setState((state) => ({
              locked: state.locked === "" ? name : "",
            }));
          }
          // for charts sharing a lock
          else {
            store.setState((state) => ({ locked: !state.locked }));
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
      />
    </>
  );
};

export default Hover;
