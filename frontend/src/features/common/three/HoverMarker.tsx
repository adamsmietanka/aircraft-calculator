import { animated, useSpring } from "@react-spring/three";
import { useEffect } from "react";
import { FONT_SIZE, NUMBERS_PADDING, useCSSColors } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { Text } from "@react-three/drei";
import { StoreApi, UseBoundStore } from "zustand";
import { Axis } from "./LineChart";
import round from "../../../utils/interpolation/round";
import {
  MarkersStore,
  SimpleMarkerStore,
  SynchronizedXMarkersStore,
} from "./Hover";

import AnimatedLine from "./AnimatedLine";

interface Props {
  name: string;
  store: UseBoundStore<
    StoreApi<SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore>
  >;
  axes: Record<string, Axis>;
  scale: number[];
  min: Record<string, number>;
  step: Record<string, number>;
}

const HoverMarker = ({ name, store, axes, scale, min, step }: Props) => {
  const { valueMultiplier: yMultiplier } = useChartUnits(axes.y.type);
  const { valueMultiplier: xMultiplier } = useChartUnits(axes.x.type);
  const { primaryColor, backgroundColor } = useCSSColors();

  const AnimatedText = animated(Text);

  const [hoverSpring, hoverApi] = useSpring(
    () => ({
      x: 0,
      y: 0,
      points: [0, 0, 0],
      opacity: 0,
      width: 2,
    }),
    []
  );

  const updatePosition = (x: number, y: number) => {
    hoverApi.start({
      x: x * scale[0],
      y: y * scale[1],
      points: [
        min.x,
        y * scale[1],
        0.1,
        x * scale[0],
        y * scale[1],
        0.1,
        x * scale[0],
        min.y,
        0.1,
      ],
    });
  };

  const updateMarker = ({
    x,
    y,
    show,
    locked,
  }: SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore) => {
    // get the values from the proper objects in store
    if (typeof x !== "number") {
      x = x[name];
    }
    if (typeof y !== "number") {
      y = y[name];
    }

    updatePosition(x, y);
    if (!!locked) {
      hoverApi.start({ opacity: 1, width: 2 });
    } else if (show) {
      hoverApi.start({ opacity: 1, width: 1 });
    } else {
      hoverApi.start({ opacity: 0 });
    }
  };

  useEffect(() => {
    store.subscribe(updateMarker);

    const timer = setTimeout(() => {
      const state = store.getState();
      updateMarker(state);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const x = store.getState().x;

  const displayX = round(
    (typeof x === "number" ? x : x[name]) / xMultiplier,
    step.x / 100
  );

  const y = store.getState().y;

  const displayY = round(
    (typeof y === "number" ? y : y[name]) / yMultiplier,
    step.y / 100
  );

  return (
    <>
      <AnimatedLine
        points={hoverSpring.points}
        opacity={hoverSpring.opacity}
        width={hoverSpring.width}
      />
      <AnimatedText
        fontSize={0.6 * FONT_SIZE}
        position={hoverSpring.x.to((x) => [x, min.y - NUMBERS_PADDING, 0.375])}
        color={primaryColor}
        fillOpacity={hoverSpring.opacity}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
        outlineOpacity={hoverSpring.opacity}
      >
        {displayX}
      </AnimatedText>
      <AnimatedText
        fontSize={0.6 * FONT_SIZE}
        position={hoverSpring.y.to((y) => [
          min.x - 1.5 * NUMBERS_PADDING,
          y,
          0.375,
        ])}
        color={primaryColor}
        fillOpacity={hoverSpring.opacity}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
        outlineOpacity={hoverSpring.opacity}
      >
        {displayY}
      </AnimatedText>
    </>
  );
};

export default HoverMarker;
