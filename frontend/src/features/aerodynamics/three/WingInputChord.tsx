import { useMemo, useRef } from "react";
import {
  MEASUREMENT_DISTANCE,
  MEASUREMENT_SIDE,
  useCSSColors,
} from "../../common/three/config";
import { useFrame } from "@react-three/fiber";
import { SpringValue, animated, to } from "@react-spring/three";
import { Html } from "@react-three/drei";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useWingStore } from "../stores/useWing";
import AnimatedTips from "../../common/drawings/AnimatedTips";
import Formula from "../../common/Formula";
import { useHoverWingStore } from "../hooks/useHoverables";

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

  const hoverWing = useHoverWingStore();

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

      <AnimatedTips scale={scale} value={chord} />

      <animated.mesh
        position={to([chord, scale], (chord, scale) => [
          chord / 2,
          (0.25 + MEASUREMENT_DISTANCE) / scale,
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
      >
        <Html className="select-none" color="black" transform prepend>
          <div className={`${hoverWing.chords && "hidden"}`}>
            <InputDrawing value={wing.chord} setter={wing.setChord} />
          </div>
          <Formula
            className={`text-xl ${hoverWing.chords || "hidden"}`}
            tex={`\\color{green}c`}
          />
        </Html>
      </animated.mesh>
    </animated.mesh>
  );
};

export default WingInputChord;
