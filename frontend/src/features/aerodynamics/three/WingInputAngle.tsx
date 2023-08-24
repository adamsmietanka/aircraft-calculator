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
  angle: SpringValue<number>;
}

const VECTOR_TIP_LENGTH = 0.15;

const ANGLE_MEAS_POINTS = 6;

const WingInputAngle = ({ chordTip, scale, x, y, angle }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const curveRef = useRef<THREE.BufferAttribute>(null);

  const wing = useWingStore();

  const { gridColor } = useCSSColors();

  const position = useMemo(() => {
    return new Float32Array(2 * 6);
  }, []);

  const curve = useMemo(() => {
    return new Float32Array(ANGLE_MEAS_POINTS * 3);
  }, []);

  useFrame(() => {
    const interpolatedChordTip = chordTip.get();
    const interpolatedTipX = x.get();
    const interpolatedY = y.get();
    const interpolatedScale = scale.get();
    const interpolatedAngle = angle.get();

    const xLeft = interpolatedTipX;
    const xRight = interpolatedTipX + interpolatedChordTip;

    position.set(
      [0, 0, 0, 0, interpolatedY / 2 + 0.2 / interpolatedScale, 0],
      0
    );

    for (let i = 0; i < ANGLE_MEAS_POINTS; i++) {
      curve.set(
        [
          (interpolatedY / 2) *
            Math.sin(
              (((i * interpolatedAngle) / (ANGLE_MEAS_POINTS - 1)) * Math.PI) /
                180
            ),
          (interpolatedY / 2) *
            Math.cos(
              (((i * interpolatedAngle) / (ANGLE_MEAS_POINTS - 1)) * Math.PI) /
                180
            ),
          0,
        ],
        i * 3
      );
    }

    if (positionRef.current && curveRef.current) {
      positionRef.current.set(position);
      positionRef.current.needsUpdate = true;
      curveRef.current.set(curve);
      curveRef.current.needsUpdate = true;
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
      <animated.line>
        <bufferGeometry>
          <bufferAttribute
            ref={curveRef}
            attach="attributes-position"
            count={curve.length / 3}
            array={curve}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={gridColor} opacity={1} transparent />
      </animated.line>
      <AnimatedCone
        args={[VECTOR_TIP_LENGTH / 2.5, VECTOR_TIP_LENGTH, 32]}
        position={to([x, y, scale], (x, y, scale) => [
          VECTOR_TIP_LENGTH / (2 * scale),
          y / 2,
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
        rotation-z={Math.PI / 2}
        material-transparent
        material-color={gridColor}
        material-opacity={1}
      />
      <AnimatedCone
        args={[VECTOR_TIP_LENGTH / 2.5, VECTOR_TIP_LENGTH, 32]}
        position={to([x, y, scale, angle], (x, y, scale, angle) => [
          (y / 2) * Math.sin((angle * Math.PI) / 180) -
            (VECTOR_TIP_LENGTH / (2 * scale)) *
              Math.cos((angle * Math.PI) / 180),
          (y / 2) * Math.cos((angle * Math.PI) / 180),
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
        rotation-z={angle.to(
          (angle) => -(Math.PI / 2 + (angle * Math.PI) / 180)
        )}
        material-transparent
        material-color={gridColor}
        material-opacity={1}
      />

      <animated.mesh
        position={to(
          [y, scale, angle],
          (y, scale, angle) => [
            (y / 2 + 0.35 / scale) * Math.sin(((angle / 2) * Math.PI) / 180),
            (y / 2 + 0.35 / scale) * Math.cos(((angle / 2) * Math.PI) / 180),
            0,
          ]
        )}
        rotation-z={angle.to((angle) => (-(angle / 2) * Math.PI) / 180)}
        scale={scale.to((scale) => [1 / scale, 1 / scale, 1 / scale])}
      >
        <Html className="select-none" color="black" transform prepend>
          <InputDrawing value={wing.angle} setter={wing.setAngle} />
        </Html>
      </animated.mesh>
    </animated.mesh>
  );
};

export default WingInputAngle;
