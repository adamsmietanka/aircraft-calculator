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
import { ReactNode } from "react";

interface Props {
  gridPositionX: number;
  items: Array<{ name: string | ReactNode; style?: string; color?: string }>;
  opacity: SpringValue<number>;
  show?: boolean;
  store?: UseBoundStore<
    StoreApi<SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore>
  >;
}

const Legend = ({
  gridPositionX,
  items,
  opacity,
  show = true,
  store,
}: Props) => {
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
            opacity={opacity.to((o) => (show ? 1 : 0))}
          />
          <AnimatedHtml position={[2, -index, 0]} className="w-20" show={show}>
            <div
              className={`${store && "cursor-pointer"} ${
                i.name === store?.getState().legend && "font-bold"
              }`}
              onClick={() =>
                store &&
                store.setState({
                  legend:
                    typeof i.name === "string" ? i.name : i.name?.toString(),
                })
              }
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
