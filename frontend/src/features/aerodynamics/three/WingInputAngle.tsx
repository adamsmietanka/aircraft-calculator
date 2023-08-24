import { useMemo, useRef } from "react";
import {
  VECTOR_TIP_LENGTH,
  VECTOR_TIP_WIDTH,
  useCSSColors,
} from "../../common/three/config";
import { useFrame } from "@react-three/fiber";
import { SpringValue, animated, to } from "@react-spring/three";
import { Cone, Html } from "@react-three/drei";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useWingStore } from "../stores/useWing";

interface Props {
  scale: SpringValue<number>;
  y: SpringValue<number>;
  angle: SpringValue<number>;
}

const ANGLE_MEAS_POINTS = 6;

const WingInputAngle = ({ scale, y, angle }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const curveRef = useRef<THREE.BufferAttribute>(null);

  const wing = useWingStore();

  const { gridColor } = useCSSColors();

  const position = useMemo(() => {
    return new Float32Array(2 * 3);
  }, []);

  const curve = useMemo(() => {
    return new Float32Array(ANGLE_MEAS_POINTS * 3);
  }, []);

  useFrame(() => {
    const interpolatedY = y.get();
    const interpolatedScale = scale.get();
    const interpolatedAngle = angle.get();

    position.set(
      [0, 0, 0, 0, interpolatedY / 2 + 0.2 / interpolatedScale, 0],
      0
    );

    for (let i = 0; i < ANGLE_MEAS_POINTS; i++) {
      curve.set(
        [
          (interpolatedY / 2) *
            Math.sin((i * interpolatedAngle) / (ANGLE_MEAS_POINTS - 1)),
          (interpolatedY / 2) *
            Math.cos((i * interpolatedAngle) / (ANGLE_MEAS_POINTS - 1)),
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
        args={[VECTOR_TIP_WIDTH, VECTOR_TIP_LENGTH, 32]}
        position={to([y, scale], (y, scale) => [
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
        args={[VECTOR_TIP_WIDTH, VECTOR_TIP_LENGTH, 32]}
        position={to([y, scale, angle], (y, scale, angle) => [
          // move the tip half its length back
          (y / 2) * Math.sin(angle) -
            (VECTOR_TIP_LENGTH / (2 * scale)) * Math.cos(angle),
          // the cone is transposed after the rotation - only X fix is needed
          (y / 2) * Math.cos(angle),
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
        rotation-z={angle.to((angle) => -(Math.PI / 2 + angle))}
        material-transparent
        material-color={gridColor}
        material-opacity={1}
      />

      <animated.mesh
        position={to([y, scale, angle], (y, scale, angle) => [
          (y / 2 + 0.35 / scale) * Math.sin(angle / 2),
          (y / 2 + 0.35 / scale) * Math.cos(angle / 2),
          0,
        ])}
        rotation-z={angle.to((angle) => -(angle / 2))}
        scale={scale.to((s) => 1 / s)}
      >
        <Html className="select-none" color="black" transform prepend>
          <InputDrawing value={wing.angle} setter={wing.setAngle} />
        </Html>
      </animated.mesh>
    </animated.mesh>
  );
};

export default WingInputAngle;
