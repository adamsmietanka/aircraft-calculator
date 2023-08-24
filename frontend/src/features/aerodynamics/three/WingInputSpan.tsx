import React, { useMemo, useRef } from "react";
import {
  MEASUREMENT_DISTANCE,
  MEASUREMENT_SIDE,
  useCSSColors,
} from "../../common/three/config";
import { useFrame } from "@react-three/fiber";
import { SpringValue, animated, to } from "@react-spring/three";
import { Cone, Html } from "@react-three/drei";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useWingStore } from "../stores/useWing";

interface Props {
  scale: SpringValue<number>;
  chordTip: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
}

const VECTOR_TIP_LENGTH = 0.15;

const WingInputSpan = ({ chordTip, scale, x, y }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);

  const wing = useWingStore();

  const { gridColor } = useCSSColors();

  const position = useMemo(() => {
    return new Float32Array(2 * 6);
  }, []);

  useFrame(() => {
    const interpolatedChordTip = chordTip.get();
    const interpolatedTipX = x.get();
    const interpolatedY = y.get();
    const interpolatedScale = scale.get();

    const xLeft = interpolatedTipX;
    const xRight = interpolatedTipX + interpolatedChordTip;

    position.set(
      [
        -MEASUREMENT_DISTANCE / interpolatedScale,
        -MEASUREMENT_DISTANCE / interpolatedScale,
        0,
        -MEASUREMENT_DISTANCE / interpolatedScale,
        interpolatedY,
        0,
      ],
      0
    );

    //top side
    position.set(
      [
        -MEASUREMENT_SIDE / interpolatedScale,
        interpolatedY,
        0,
        interpolatedTipX,
        interpolatedY,
        0,
      ],
      6
    );

    if (positionRef.current) {
      positionRef.current.set(position);
      positionRef.current.needsUpdate = true;
    }
  });
  const AnimatedCone = animated(Cone);

  return (
    <animated.mesh>
      <animated.lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={positionRef}
            attach="attributes-position"
            count={position.length / 3}
            array={position}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={gridColor} opacity={1} transparent />
      </animated.lineSegments>
      <AnimatedCone
        args={[VECTOR_TIP_LENGTH / 3, VECTOR_TIP_LENGTH, 32]}
        position={to([chordTip, x, y, scale], (chordTip, x, y, scale) => [
          -MEASUREMENT_DISTANCE / scale,
          y - VECTOR_TIP_LENGTH / 2,
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
        material-transparent
        material-color={gridColor}
        material-opacity={1}
      />

      <animated.mesh
        position={to([chordTip, x, y, scale], (chordTip, x, y, scale) => [
          -(0.25 + MEASUREMENT_DISTANCE) / scale,
          0,
          0,
        ])}
        scale={scale.to((scale) => [1 / scale, 1 / scale, 1 / scale])}
        rotation-z={Math.PI / 2}
      >
        <Html className="select-none" color="black" transform prepend>
          <InputDrawing value={wing.span} setter={wing.setSpan} />
        </Html>
      </animated.mesh>
    </animated.mesh>
  );
};

export default WingInputSpan;
