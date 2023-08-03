import { animated, to, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { NUMBERS_PADDING, useCSSColors } from "../../power_unit/three/config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { MeshLineGeometry, Text } from "@react-three/drei";
import { StoreApi, UseBoundStore } from "zustand";
import { ChartStore } from "../../power_unit/PowerUnitEngine";
import { MeshLineMaterial } from "meshline";
import { Axis } from "../../power_unit/three/LineChart";
import round from "../../../utils/interpolation/round";

interface Props {
  store: UseBoundStore<StoreApi<ChartStore>>;
  axes: Record<string, Axis>;
  scale: number[];
  min: Record<string, number>;
  step: Record<string, number>;
}

const HoverMarker = ({ store, axes, scale, min, step }: Props) => {
  const { valueMultiplier: yMultiplier } = useChartUnits(axes.y.type);
  const { valueMultiplier: xMultiplier } = useChartUnits(axes.x.type);
  const { gridColor, primaryColor, backgroundColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const [hoverSpring, hoverApi] = useSpring(
    () => ({
      x: 0,
      y: 0,
      points: [],
      opacity: 0,
      width: 2,
    }),
    []
  );

  const [scaleSpring] = useSpring(
    () => ({
      x: scale[0],
      y: scale[1],
    }),
    [scale]
  );

  const updatePosition = (x: number, y: number) => {
    hoverApi.start({
      x,
      y,
      points: [min.x / scale[0], y, 0, x, y, 0, x, min.y / scale[1], 0],
    });
  };

  const updateMarker = ({ x, y, hover, locked }: ChartStore) => {
    updatePosition(x, y);
    if (locked) {
      hoverApi.start({ opacity: 1, width: 2 });
    } else if (hover) {
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

  const geometryRef = useRef<MeshLineGeometry>(null);
  const materialRef = useRef<MeshLineMaterial>(null);

  useFrame(() => {
    const interpolatedPoints = hoverSpring.points.get();
    const interpolatedOpacity = hoverSpring.opacity.get();
    const interpolatedWidth = hoverSpring.width.get();

    if (geometryRef.current && materialRef.current) {
      materialRef.current.opacity = interpolatedOpacity;
      materialRef.current.lineWidth = interpolatedWidth * 0.005;
      geometryRef.current.setPoints(interpolatedPoints);
    }
  });

  return (
    <animated.mesh
      scale={to([scaleSpring.x, scaleSpring.y], (x, y) => [x, y, 1])}
    >
      <AnimatedText
        fontSize={0.6}
        position={to([hoverSpring.x, scaleSpring.y], (x, scale) => [
          x,
          (min.y - NUMBERS_PADDING) / scale,
          0,
        ])}
        scale={to([scaleSpring.x, scaleSpring.y], (x, y) => [1 / x, 1 / y, 1])}
        color={primaryColor}
        fillOpacity={hoverSpring.opacity}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
        outlineOpacity={hoverSpring.opacity}
      >
        {round(
          (hoverSpring.x.goal || store.getState().x) / xMultiplier,
          step.x / 100
        )}
      </AnimatedText>
      <AnimatedText
        fontSize={0.6}
        position={to([hoverSpring.y, scaleSpring.x], (y, scale) => [
          (min.x - 1.5 * NUMBERS_PADDING) / scale,
          y,
          0,
        ])}
        scale={to([scaleSpring.x, scaleSpring.y], (x, y) => [1 / x, 1 / y, 1])}
        color={primaryColor}
        fillOpacity={hoverSpring.opacity}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
        outlineOpacity={hoverSpring.opacity}
      >
        {round(
          (hoverSpring.y.goal || store.getState().y) / yMultiplier,
          step.y / 100
        )}
      </AnimatedText>

      <meshLineGeometry ref={geometryRef} points={[0, 0, 0, 1000, 1000, 0]} />
      <meshLineMaterial
        ref={materialRef}
        dashArray={0.01}
        dashOffset={1}
        dashRatio={0.8}
        transparent
        lineWidth={0.005}
        color={gridColor}
      />
    </animated.mesh>
  );
};

export default HoverMarker;
