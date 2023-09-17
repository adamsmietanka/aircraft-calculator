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
import { Mesh, Object3D } from "three";
import AnimatedHtml from "../../common/three/AnimatedHtml";

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
    const tip = chordTip.get();
    const interpolatedScale = scale.get();

    position.set(
      [
        0,
        MEASUREMENT_DISTANCE / interpolatedScale,
        0,
        tip,
        MEASUREMENT_DISTANCE / interpolatedScale,
        0,
      ],
      0
    );

    //left side
    position.set([0, 0, 0, 0, MEASUREMENT_SIDE / interpolatedScale, 0], 6);

    //right side
    position.set([tip, 0, 0, tip, MEASUREMENT_SIDE / interpolatedScale, 0], 12);

    if (positionRef.current) {
      positionRef.current.set(position);
      positionRef.current.needsUpdate = true;
    }
  });

  const hoverWing = useHoverWingStore();

  return (
    <animated.mesh position={to([x, y], (x, y) => [x, y, 0])}>
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

      <AnimatedTips scale={scale} value={chordTip} />

      <AnimatedHtml
        position-x={chordTip.to((chordTip) => chordTip / 2)}
        position-y={scale.to((scale) => (0.25 + MEASUREMENT_DISTANCE) / scale)}
        scale={scale.to((scale) => 1 / scale)}
      >
        <div className={`${hoverWing.chords && "hidden"}`}>
          <InputDrawing value={wing.chordTip} setter={wing.setChordTip} />
        </div>
        <Formula
          className={`text-xl ${hoverWing.chords || "hidden"}`}
          tex={`\\color{orange}c_t`}
        />
      </AnimatedHtml>
    </animated.mesh>
  );
};

export default WingInputTip;
