import { Axis } from "../../power_unit/three/LineChart";
import { Plane } from "@react-three/drei";
import { StoreApi, UseBoundStore } from "zustand";
import { ChartStore } from "../../power_unit/PowerUnitEngine";
import HoverMarker from "./HoverMarker";
import round from "../../../utils/interpolation/round";

interface HoverProps {
  axes: Record<string, Axis>;
  min: Record<string, number>;
  mid: Record<string, number>;
  scale: Array<number>;
  step: Record<string, number>;
  store: UseBoundStore<StoreApi<ChartStore>>;
}

const Hover = ({ axes, min, mid, scale, step, store }: HoverProps) => {
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
            store.setState({ x });
          }
        }}
        onPointerEnter={(e) => {
          store.setState({ hover: true });
        }}
        onPointerLeave={(e) => {
          store.setState({ hover: false });
        }}
        onClick={(e) => {
          store.setState((state) => ({ locked: !state.locked }));
        }}
      />
      <HoverMarker
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
