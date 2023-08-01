import { animated, to, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { NUMBERS_PADDING, useCSSColors } from "../../power_unit/three/config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { MeshLineGeometry, Text } from "@react-three/drei";
import { StoreApi, UseBoundStore } from "zustand";
import { ChartStore } from "../../power_unit/PowerUnitEngine";
import { MeshLineMaterial } from "meshline";
import { Axis } from "../../power_unit/three/LineChart";

interface Props {
  store: UseBoundStore<StoreApi<ChartStore>>;
  axes: Record<string, Axis>;
  scale: number[];
  step: Record<string, number>;
}

const HoverMarker = ({ store, axes, scale, step }: Props) => {
  const { valueMultiplier: yMultiplier } = useChartUnits(axes.y.type);
  const { valueMultiplier: xMultiplier } = useChartUnits(axes.x.type);
  const { gridColor, primaryColor, backgroundColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const [marker, api] = useSpring(
    () => ({
      x: 0,
      y: 500,
      points: [],
    }),
    []
  );

  const [opacitySpring, opacityApi] = useSpring(
    () => ({
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

  const changeY = ({ x, y, hover, locked }: ChartStore) => {
    api.start({ x: x, y: y, points: [0, y, 0, x, y, 0, x, 0, 0] });
    hover && opacityApi.start({ opacity: 1 });
    locked || hover || opacityApi.start({ opacity: 0 });
    locked && opacityApi.start({ width: 2 });
    locked || opacityApi.start({ width: 1 });
  };

  useEffect(() => store.subscribe(changeY), []);

  const geometryRef = useRef<MeshLineGeometry>(null);
  const materialRef = useRef<MeshLineMaterial>(null);

  useFrame(() => {
    const interpolatedPoints = marker.points.get();
    const interpolatedOpacity = opacitySpring.opacity.get();
    const interpolatedWidth = opacitySpring.width.get();

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
        position={to([marker.x, scaleSpring.y], (x, scale) => [
          x,
          -NUMBERS_PADDING / scale,
          0,
        ])}
        scale={to([scaleSpring.x, scaleSpring.y], (x, y) => [1 / x, 1 / y, 1])}
        color={primaryColor}
        fillOpacity={opacitySpring.opacity}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
        outlineOpacity={opacitySpring.opacity}
      >
        {(marker.x.goal / xMultiplier).toPrecision(4)}
      </AnimatedText>
      <AnimatedText
        fontSize={0.6}
        position={to([marker.y, scaleSpring.x], (y, scale) => [
          (-1.75 * NUMBERS_PADDING) / scale,
          y,
          0,
        ])}
        scale={to([scaleSpring.x, scaleSpring.y], (x, y) => [1 / x, 1 / y, 1])}
        color={primaryColor}
        fillOpacity={opacitySpring.opacity}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
        outlineOpacity={opacitySpring.opacity}
      >
        {(marker.y.goal / yMultiplier).toPrecision(4)}
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
