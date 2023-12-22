import { SpringValue, to, useSpring } from "@react-spring/three";
import { animated, useSpring as useSpringWeb } from "@react-spring/web";
import { NUMBERS_PADDING } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
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
import AnimatedHtml from "./AnimatedHtml";
import useConfig from "../subtitles/hooks/useConfig";
import { useAnimationStore } from "../subtitles/stores/useAnimation";
import { ReactComponent as PadlockIcon } from "../../../assets/padlock.svg";

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
  show: boolean;
  disable: boolean;
}

const HoverMarker = ({
  name,
  store,
  axes,
  scale,
  min,
  step,
  opacity,
  show,
  disable,
}: Props) => {
  const meshRef = useRef<Mesh>(null!);
  const { valueMultiplier: yMultiplier } = useChartUnits(axes.y.type);
  const { valueMultiplier: xMultiplier } = useChartUnits(axes.x.type);

  const slowdown = useAnimationStore((state) => state.slowdown);

  const worldScale = useMemo(() => new Vector3(1, 1, 1), []);

  useFrame(() => {
    worldScale.setFromMatrixScale(meshRef.current.matrixWorld);
  });

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

  const { customConfig } = useConfig();

  const [hoverSpring] = useSpring(
    () => ({
      x: x,
      y: y,
      opacity: !!locked || hover ? 1 : 0,
      scale: scale[0],
      config: customConfig,
    }),
    [x, y, scale, locked, hover]
  );

  const [values] = useSpringWeb(
    () => ({
      x,
      y,
      config: customConfig,
    }),
    [x, y]
  );

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
        width={!!locked ? 2 : 1}
        dashSize={0.25}
        gapSize={0.75}
        dashScale={3}
        color="grid"
      />
      <AnimatedHtml
        className="text-base text-primary bg-base-100 p-1"
        show={show && (!!locked || hover)}
        position={to([hoverSpring.y, hoverSpring.scale], (y, scale) => [
          (min.x - 1.5 * NUMBERS_PADDING) / scale,
          y,
          0.375,
        ])}
      >
        <animated.div>
          {slowdown
            ? values.y.to((y) => round(y / yMultiplier, step.y / 100))
            : displayY}
        </animated.div>
      </AnimatedHtml>
      <AnimatedHtml
        className="text-base text-primary bg-base-100 p-1"
        show={show && (!!locked || hover)}
        position={hoverSpring.x.to((x) => [
          x,
          (min.y - 0.75 * NUMBERS_PADDING) / worldScale.y,
          0.375,
        ])}
      >
        <animated.div>
          {slowdown
            ? values.x.to((x) => round(x / xMultiplier, step.x / 100))
            : displayX}
        </animated.div>
      </AnimatedHtml>

      {/* padlocks */}
      <AnimatedHtml
        show={show && !disable && locked === "Coefficient of Drag"}
        position={to([hoverSpring.y, hoverSpring.scale], (y, scale) => [
          min.x / scale,
          y,
          0.1,
        ])}
      >
        <PadlockIcon
          className={`w-4 relative left-2 bottom-4 lock ${
            locked === "Coefficient of Drag" && "locked"
          }`}
        />
      </AnimatedHtml>
      <AnimatedHtml
        show={
          show &&
          !disable &&
          locked === "Coefficient of Lift" &&
          name === "Coefficient of Lift"
        }
        position={hoverSpring.x.to((x) => [x, min.y / worldScale.y, 0.1])}
      >
        <PadlockIcon
          className={`w-4 relative left-4 bottom-4 lock ${
            locked === "Coefficient of Lift" && "locked"
          }`}
        />
      </AnimatedHtml>
    </mesh>
  );
};

export default HoverMarker;
