import { Axis } from "../../power_unit/three/LineChart";
import { Plane } from "@react-three/drei";
import { StoreApi, UseBoundStore } from "zustand";
import {
  AnotherChartStore,
  ChartStore,
} from "../../power_unit/PowerUnitEngine";
import HoverMarker from "./HoverMarker";
import round from "../../../utils/interpolation/round";

interface HoverProps {
  name: string;
  axes: Record<string, Axis>;
  min: Record<string, number>;
  mid: Record<string, number>;
  scale: Array<number>;
  step: Record<string, number>;
  store: UseBoundStore<StoreApi<ChartStore | AnotherChartStore>>;
}

const Hover = ({ name, axes, min, mid, scale, step, store }: HoverProps) => {
  return (
    <>
      <Plane
        args={[200, 200]}
        position-x={100 + min.x}
        position-y={100 + min.y}
        material-transparent
        material-opacity={0}
        onPointerMove={(e) => {
          const x = round((e.point.x + mid.x) / scale[0], step.x / 10);
          const locked = store.getState().locked;
          const oldX = store.getState().x;

          if (!locked && x !== oldX) {
            if (typeof oldX === "number") {
              store.setState({ x });
            } else {
              store.setState({ x: { ...oldX, [name]: x } });
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
          if (typeof oldLocked === "string") {
            store.setState((state) => ({
              locked: state.locked === "" ? name : "",
            }));
          } else {
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
      />
    </>
  );
};

export default Hover;
