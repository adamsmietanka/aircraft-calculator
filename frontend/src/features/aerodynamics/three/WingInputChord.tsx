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
  chord: SpringValue<number>;
}

const WingInputChord = ({ chord, scale }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);

  const wing = useWingStore();

  const { gridColor } = useCSSColors();

  const position = useMemo(() => {
    return new Float32Array(3 * 6);
  }, []);

  useFrame(() => {
    const interpolatedChord = chord.get();
    const interpolatedScale = scale.get();

    position.set(
      [
        0,
        MEASUREMENT_DISTANCE / interpolatedScale,
        0,
        interpolatedChord,
        MEASUREMENT_DISTANCE / interpolatedScale,
        0,
      ],
      0
    );

    //left side
    position.set([0, 0, 0, 0, MEASUREMENT_SIDE / interpolatedScale, 0], 6);

    //right side
    position.set(
      [
        interpolatedChord,
        0,
        0,
        interpolatedChord,
        MEASUREMENT_SIDE / interpolatedScale,
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
        position={scale.to((scale) => [
          VECTOR_TIP_LENGTH / (2 * scale),
          MEASUREMENT_DISTANCE / scale,
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
        position={to([chord, scale], (chord, scale) => [
          chord - VECTOR_TIP_LENGTH / (2 * scale),
          MEASUREMENT_DISTANCE / scale,
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
        rotation-z={-Math.PI / 2}
        material-transparent
        material-color={gridColor}
        material-opacity={1}
      />

      <animated.mesh
        position={to([chord, scale], (chord, scale) => [
          chord / 2,
          (0.25 + MEASUREMENT_DISTANCE) / scale,
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
      >
        <Html className="select-none" color="black" transform prepend>
          <InputDrawing value={wing.chord} setter={wing.setChord} />
        </Html>
      </animated.mesh>
    </animated.mesh>
  );
};

export default WingInputChord;
