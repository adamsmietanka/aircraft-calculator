import { useMemo, useRef } from "react";
import {
  MEASUREMENT_DISTANCE,
  MEASUREMENT_SIDE,
  useCSSColors,
} from "../../common/three/config";
import { useFrame } from "@react-three/fiber";
import { SpringValue, animated, to } from "@react-spring/three";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useWingStore } from "../stores/useWing";
import AnimatedTips from "../../common/drawings/AnimatedTips";
import Formula from "../../common/Formula";
import { useHoverWingStore } from "../hooks/useHoverables";
import AnimatedHtml from "../../common/three/AnimatedHtml";

interface Props {
  scale: SpringValue<number>;
  chord: SpringValue<number>;
  opacity: SpringValue<number>;
}

const WingInputChord = ({ chord, scale, opacity }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

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
    if (materialRef.current) {
      materialRef.current.opacity = opacity.get();
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
        <lineBasicMaterial
          ref={materialRef}
          color={gridColor}
          opacity={1}
          transparent
        />
      </animated.lineSegments>

      <AnimatedTips opacity={opacity} scale={scale} value={chord} />

      <AnimatedHtml
        position={to([chord, scale], (chord, scale) => [
          chord / 2,
          (0.25 + MEASUREMENT_DISTANCE) / scale,
          0,
        ])}
        scale={scale.to((s) => 1 / s)}
      >
        <div className={`${hoverWing.chords && "hidden"}`}>
          <InputDrawing value={wing.chord} setter={wing.setChord} />
        </div>
        <Formula
          className={`text-xl ${hoverWing.chords || "hidden"}`}
          tex="\color{green} c"
        />
      </AnimatedHtml>
    </animated.mesh>
  );
};

export default WingInputChord;
