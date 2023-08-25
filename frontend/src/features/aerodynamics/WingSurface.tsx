import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useWing3D from './three/hooks/useWing3D';
import { Shape } from 'three';
import { useWingStore } from './stores/useWing';
import AnimatedHtml from './three/AnimatedHtml';
import Formula from '../common/Formula';
import { animated, SpringValue, useSpring } from '@react-spring/three';
import useWingAerodynamics from './hooks/useWingAerodynamics';
import { create } from 'zustand';

const getXTip = (angle: number, span: number) =>
  (Math.tan((angle * Math.PI) / 180) * span) / 2;

export interface HoverStore {
  surface: boolean;
  b: boolean;
  chords: boolean;
  y: number;
  hover: boolean;
  show: boolean;
  locked: boolean;
  set: (value: Partial<HoverStore>) => void;
}

const useHoverWingStore = create<HoverStore>()((set) => ({
  surface: false,
  b: false,
  chords: false,
  y: 2,
  hover: false,
  show: false,
  locked: false,
  set: (value) => set(value),
}));

interface Props {
  scale: SpringValue<number>;
}

const WingSurface = ({ scale }: Props) => {
  const shapeRef = useRef<THREE.ShapeGeometry>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const { trace } = useWing3D();
  const wing = useWingStore();
  const hoverStore = useHoverWingStore();

  const { area, aspectRatio } = useWingAerodynamics();

  useFrame(() => {
    //   if (shapeRef.current) {
    //     console.log(shapeRef.current);
    //   }
    // if (materialRef.current) {
    //   const opac = hoverSpring.surface.get();
    //   materialRef.current.opacity = opac;
    // }
    // console.log(hoverSpring.surface.get());
  });

  const shape = useMemo(() => {
    const xTip = getXTip(wing.angle, wing.span);
    const shape = new Shape();

    shape.lineTo(xTip, wing.span / 2);
    shape.lineTo(xTip + wing.chordTip, wing.span / 2);
    shape.lineTo(wing.chord, 0);
    shape.lineTo(xTip + wing.chordTip, -wing.span / 2);
    shape.lineTo(xTip, -wing.span / 2);
    return shape;
  }, [wing]);

  const b = useMemo(() => {
    const xEnd = getXTip(wing.angle, wing.span) + wing.chordTip;
    const shape = new Shape();
    const scal = scale.get();

    shape.moveTo(xEnd + 1 / scal, -wing.span / 2);
    shape.lineTo(xEnd + 1 / scal, wing.span / 2);
    shape.lineTo(xEnd + 1.1 / scal, wing.span / 2);
    shape.lineTo(xEnd + 1.1 / scal, -wing.span / 2);
    return shape;
  }, [wing]);

  const [hoverSpring] = useSpring(
    () => ({
      surface: hoverStore.surface ? 0.5 : 0,
      b: hoverStore.b ? 0.75 : 0,
      chords: hoverStore.chords ? 0.75 : 0,
    }),
    [hoverStore.surface]
  );

  return (
    <>
      <mesh>
        <shapeGeometry args={[shape]} ref={shapeRef} />
        <animated.meshBasicMaterial
          color="green"
          transparent
          opacity={hoverSpring.surface.to((o) => o)}
        />
      </mesh>
      <mesh>
        <shapeGeometry args={[b]} ref={shapeRef} />
        <animated.meshBasicMaterial
          color="red"
          transparent
          opacity={hoverSpring.b.to((o) => o)}
        />
      </mesh>
      <animated.mesh position-y={scale.to((s) => -3 / s)} position-x={-0.5}>
        <AnimatedHtml color={'green'} show={true}>
          <Formula
            className="text-2xl"
            tex={`S=${area.toFixed(2)}\\, m^2`}
            onPointerEnter={() => hoverStore.set({ surface: true })}
            onPointerLeave={() => hoverStore.set({ surface: false })}
          />
          <Formula
            className="flex items-center h-10 text-3xl"
            tex={`\\Lambda=${
              hoverStore.b
                ? ' \\frac{\\color{red}b^2}{\\color{green}S}'
                : aspectRatio.toFixed(2)
            }`}
            onPointerEnter={() => hoverStore.set({ surface: true, b: true })}
            onPointerLeave={() => hoverStore.set({ surface: false, b: false })}
          />
        </AnimatedHtml>
      </animated.mesh>
    </>
  );
};

export default WingSurface;
