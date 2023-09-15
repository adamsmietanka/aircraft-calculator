import { useMemo, useRef } from "react";
import {
  MEASUREMENT_DISTANCE,
  MEASUREMENT_SIDE,
  useCSSColors,
} from "../../common/three/config";
import { useFrame } from "@react-three/fiber";
import { SpringValue, animated } from "@react-spring/three";
import { Html } from "@react-three/drei";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useWingStore } from "../stores/useWing";
import AnimatedTip from "../../common/drawings/AnimatedTip";
import Formula from "../../common/Formula";
import { useHoverWingStore } from "./WingHoverables";

interface Props {
  scale: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
}

const WingInputSpan = ({ scale, x, y }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);

  const wing = useWingStore();

  const { gridColor } = useCSSColors();

  const position = useMemo(() => {
    return new Float32Array(2 * 6);
  }, []);

  useFrame(() => {
    const interpolatedTipX = x.get();
    const interpolatedY = y.get();
    const interpolatedScale = scale.get();

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
      <mesh rotation-z={Math.PI / 2}>
        <AnimatedTip scale={scale} value={y} end />

        <animated.mesh
          position={scale.to((scale) => [
            0,
            (0.25 + MEASUREMENT_DISTANCE) / scale,
            0,
          ])}
          scale={scale.to((s) => 1 / s)}
        >
          <Html className="select-none" color="black" transform prepend>
            <div className={`${hoverWing.b && "hidden"}`}>
              <InputDrawing value={wing.span} setter={wing.setSpan} />
            </div>
            <Formula
              className={`text-xl ${hoverWing.b || "hidden"}`}
              tex={`\\color{red}b`}
            />
          </Html>
        </animated.mesh>
      </mesh>
    </animated.mesh>
  );
};

export default WingInputSpan;
