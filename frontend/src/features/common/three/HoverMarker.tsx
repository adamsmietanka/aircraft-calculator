import { animated, useSpring } from "@react-spring/three";
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

  const locked = store((state) => state.locked);
  const show = store((state) => state.show);

  const xObj = store((state) => state.x);
  const yObj = store((state) => state.y);

  // get the values from the proper objects in store
  const x = typeof xObj !== "number" ? xObj[name] : xObj;
  const y = typeof yObj !== "number" ? yObj[name] : yObj;

  const points = [
    [min.x / scale[0], y, 0.1],
    [x, y, 0.1],
    [x, min.y / scale[1], 0.1],
  ];

  const [hoverSpring] = useSpring(
    () => ({
      x: x * scale[0],
      y: y * scale[1],
      opacity: !!locked || show ? 1 : 0,
    }),
    [x, y, scale, locked, show]
  );

  const opacity = !!locked || show ? 1 : 0;
  const width = !!locked ? 2 : 1;

  const displayX = round(x / xMultiplier, step.x / 100);
  const displayY = round(y / yMultiplier, step.y / 100);

  return (
    <>
      <AnimatedLine
        points={points}
        scale={scale}
        opacity={opacity}
        width={width}
        dashSize={0.25}
        gapSize={0.75}
        dashScale={3}
        color="grid"
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
