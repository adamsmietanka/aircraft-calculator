import { useMemo, useRef } from "react";
import {
  MEASUREMENT_DISTANCE,
  MEASUREMENT_SIDE,
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
  chordTip: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
}

const WingInputTip = ({ chordTip, scale, x, y }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);

  const wing = useWingStore();

  const { gridColor } = useCSSColors();

  const position = useMemo(() => {
    return new Float32Array(3 * 6);
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
        xLeft,
        interpolatedY + MEASUREMENT_DISTANCE / interpolatedScale,
        0,
        xRight,
        interpolatedY + MEASUREMENT_DISTANCE / interpolatedScale,
        0,
      ],
      0
    );

    //left side
    position.set(
      [
        xLeft,
        interpolatedY,
        0,
        xLeft,
        interpolatedY + MEASUREMENT_SIDE / interpolatedScale,
        0,
      ],
      6
    );

    //right side
    position.set(
      [
        xRight,
        interpolatedY,
        0,
        xRight,
        interpolatedY + MEASUREMENT_SIDE / interpolatedScale,
        0,
      ],
      12
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
        args={[VECTOR_TIP_WIDTH, VECTOR_TIP_LENGTH, 32]}
        position={to([x, y, scale], (x, y, scale) => [
          x + VECTOR_TIP_LENGTH / (2 * scale),
          y + MEASUREMENT_DISTANCE / scale,
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
        position={to([chordTip, x, y, scale], (chordTip, x, y, scale) => [
          x + chordTip - VECTOR_TIP_LENGTH / (2 * scale),
          y + MEASUREMENT_DISTANCE / scale,
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
        rotation-z={-Math.PI / 2}
        material-transparent
        material-color={gridColor}
        material-opacity={1}
      />

      <animated.mesh
        position={to([chordTip, x, y, scale], (chordTip, x, y, scale) => [
          x + chordTip / 2,
          y + (0.25 + MEASUREMENT_DISTANCE) / scale,
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
      >
        <Html className="select-none" color="black" transform prepend>
          <InputDrawing value={wing.chordTip} setter={wing.setChordTip} />
        </Html>
      </animated.mesh>
    </animated.mesh>
  );
};

export default WingInputTip;
