import { SpringValue, animated, to, useSpring } from "@react-spring/three";
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
import { useMemo, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface Props {
  name: string;
  store: UseBoundStore<
    StoreApi<SimpleMarkerStore | SynchronizedXMarkersStore | MarkersStore>
  >;
  axes: Record<string, Axis>;
  scale: number[];
  min: Record<string, number>;
  step: Record<string, number>;
  opacity: SpringValue<number>;
}

const HoverMarker = ({
  name,
  store,
  axes,
  scale,
  min,
  step,
  opacity,
}: Props) => {
  const meshRef = useRef<Mesh>(null!);
  const textRef = useRef<Mesh>(null!);
  const textRef2 = useRef<Mesh>(null!);
  const { valueMultiplier: yMultiplier } = useChartUnits(axes.y.type);
  const { valueMultiplier: xMultiplier } = useChartUnits(axes.x.type);
  const { primaryColor, backgroundColor } = useCSSColors();

  const worldScale = useMemo(() => new Vector3(1, 1, 1), []);

  useFrame(() => {
    worldScale.setFromMatrixScale(meshRef.current.matrixWorld);
    textRef.current.scale.set(
      1 / worldScale.getComponent(0),
      1 / worldScale.getComponent(1),
      1 / worldScale.getComponent(2)
    );
    textRef2.current.scale.set(
      1 / worldScale.getComponent(0),
      1 / worldScale.getComponent(1),
      1 / worldScale.getComponent(2)
    );
  });

  const AnimatedText = animated(Text);

  const locked = store((state) => state.locked);
  const hover = store((state) => state.hover);

  const xObj = store((state) => state.x);
  const yObj = store((state) => state.y);

  // get the values from the proper objects in store
  const x = typeof xObj !== "number" ? xObj[name] : xObj;
  const y = typeof yObj !== "number" ? yObj[name] : yObj;

  const points = [
    [min.x / worldScale.x, y, 0.05],
    [x, y, 0.05],
    [x, min.y / worldScale.y, 0.05],
  ];

  const [hoverSpring] = useSpring(
    () => ({
      x: x,
      y: y,
      opacity: !!locked || hover ? 1 : 0,
      scale: scale[0],
    }),
    [x, y, scale, locked, hover]
  );

  const width = !!locked ? 2 : 1;

  const displayX = round(x / xMultiplier, step.x / 100);
  const displayY = round(y / yMultiplier, step.y / 100);

  return (
    <mesh ref={meshRef}>
      <AnimatedLine
        points={points}
        opacity={to(
          [hoverSpring.opacity, opacity],
          (opacity, stepOpacity) => opacity * stepOpacity
        )}
        width={width}
        dashSize={0.25}
        gapSize={0.75}
        dashScale={3}
        color="grid"
      />
      <AnimatedText
        ref={textRef}
        fontSize={0.6 * FONT_SIZE}
        position={hoverSpring.x.to((x) => [
          x,
          (min.y - NUMBERS_PADDING) / worldScale.y,
          0.375,
        ])}
        color={primaryColor}
        fillOpacity={to(
          [hoverSpring.opacity, opacity],
          (opacity, stepOpacity) => opacity * stepOpacity
        )}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
        outlineOpacity={to(
          [hoverSpring.opacity, opacity],
          (opacity, stepOpacity) => opacity * stepOpacity
        )}
      >
        {displayX}
      </AnimatedText>
      <AnimatedText
        ref={textRef2}
        fontSize={0.6 * FONT_SIZE}
        position={to([hoverSpring.y, hoverSpring.scale], (y, scale) => [
          (min.x - 1.5 * NUMBERS_PADDING) / scale,
          y,
          0.375,
        ])}
        color={primaryColor}
        fillOpacity={to(
          [hoverSpring.opacity, opacity],
          (opacity, stepOpacity) => opacity * stepOpacity
        )}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
        outlineOpacity={to(
          [hoverSpring.opacity, opacity],
          (opacity, stepOpacity) => opacity * stepOpacity
        )}
      >
        {displayY}
      </AnimatedText>
    </mesh>
  );
};

export default HoverMarker;
