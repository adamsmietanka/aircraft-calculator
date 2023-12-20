import { SpringValue, animated } from "@react-spring/three";
import { CANVAS_WIDTH } from "../../common/three/config";
import AnimatedLine from "./AnimatedLine";
import { StoreApi, UseBoundStore } from "zustand";
import {
  MarkersStore,
  SimpleMarkerStore,
  SynchronizedXMarkersStore,
} from "./Hover";
import AnimatedHtml from "./AnimatedHtml";

interface Props {
  gridPositionX: number;
  items: Array<Record<string, string>>;
  opacity: SpringValue<number>;
  store?: UseBoundStore<
    StoreApi<SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore>
  >;
}

const Legend = ({ gridPositionX, items, opacity, store }: Props) => {
  return (
    <animated.mesh
      position-x={(gridPositionX * CANVAS_WIDTH) / 2}
      position-y={items.length / 2}
    >
      {items.map((i, index) => (
        <mesh key={index}>
          <AnimatedLine
            points={[
              [0, 0 - index, 0],
              [0.75, 0 - index, 0],
            ]}
            style={i.style}
            color={i.color}
            opacity={opacity}
          />
          <AnimatedHtml position={[2, -index, 0]} className="w-20">
            <div
              className={`${store && "cursor-pointer"} ${
                i.name === store?.getState().legend && "font-bold"
              }`}
              onClick={() => store && store.setState({ legend: i.name })}
            >
              {i.name}
            </div>
          </AnimatedHtml>
        </mesh>
      ))}
    </animated.mesh>
  );
};

export default Legend;
