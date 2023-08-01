import { animated, to, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { NUMBERS_PADDING, useCSSColors } from "../../power_unit/three/config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { MeshLineGeometry, Text } from "@react-three/drei";
import { StoreApi, UseBoundStore } from "zustand";
import { ChartStore } from "../../power_unit/PowerUnitEngine";
import { MeshLineMaterial } from "meshline";

interface Props {
  store: UseBoundStore<StoreApi<ChartStore>>;
  type: string | undefined;
  scale: number[];
  //   opacity: SpringValue<number>;
}

const HoverMarker = ({ store, type, scale }: Props) => {
  const { displayMultiplier, valueMultiplier } = useChartUnits(type);
  const { gridColor, primaryColor, backgroundColor } = useCSSColors();
  const AnimatedText = animated(Text);

  const position = useMemo(() => {
    return new Float32Array([0, 0, 0, 200, 0, 0]);
  }, []);

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

  const changeY = ({ x, y, hover }: ChartStore) => {
    api.start({ x: x, y: y, points: [0, y, 0, x, y, 0, x, 0, 0] });
    hover && opacityApi.start({ opacity: 1 });
    hover || opacityApi.start({ opacity: 0 });
  };

  useEffect(() => store.subscribe(changeY), []);

  const geometryRef = useRef<MeshLineGeometry>(null);
  const materialRef = useRef<MeshLineMaterial>(null);

  useFrame(() => {
    const interpolatedPoints = marker.points.get();
    const interpolatedOpacity = opacitySpring.opacity.get();

    if (geometryRef.current && materialRef.current) {
      materialRef.current.opacity = interpolatedOpacity;
      geometryRef.current.setPoints(interpolatedPoints);
    }
  });

  return (
    <animated.mesh scale={scaleSpring.y.to((y) => [1, y, 1])}>
      <AnimatedText
        fontSize={0.6}
        position={marker.y.to((y) => [-1.5 * NUMBERS_PADDING, y, 0])}
        scale={scaleSpring.y.to((y) => [1, 1 / y, 1])}
        color={primaryColor}
        fillOpacity={opacitySpring.opacity}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
        outlineOpacity={opacitySpring.opacity}
      >
        {(marker.y.goal / valueMultiplier).toPrecision(4)}
      </AnimatedText>

      <animated.mesh scale={scaleSpring.x.to((x) => [x, 1, 1])}>
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
    </animated.mesh>
  );
};

export default HoverMarker;
