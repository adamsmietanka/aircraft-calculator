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
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const { displayMultiplier, valueMultiplier } = useChartUnits(type);
  const { gridColor, primaryColor, backgroundColor } = useCSSColors();
  const AnimatedText = animated(Text);
  console.log(valueMultiplier, type);

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

  const [scaleSpring] = useSpring(
    () => ({
      x: scale[0],
      y: scale[1],
    }),
    [scale]
  );

  const changeY = ({ x, y }: ChartStore) => {
    console.log(x, y);
    api.start({ x: x, y: y, points: [0, y, 0, x, y, 0, x, 0, 0] });
  };

  useEffect(() => store.subscribe(changeY), []);

  const geometryRef = useRef<MeshLineGeometry>(null);
  const materialRef = useRef<MeshLineMaterial>(null);

  useFrame(() => {
    const interpolatedPoints = marker.points.get();

    if (geometryRef.current && materialRef.current) {
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
        fillOpacity={1}
        outlineWidth={0.2}
        outlineColor={backgroundColor}
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
