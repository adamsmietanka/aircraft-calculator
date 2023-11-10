import { useMemo, useRef } from "react";
import { useCSSColors } from "../../common/three/config";
import { useFrame } from "@react-three/fiber";
import { SpringValue, animated, to } from "@react-spring/three";
import { useWingStore } from "../stores/useWing";
import AnimatedTip from "../../common/drawings/AnimatedTip";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import InputDrawingAngle from "../../common/inputs/InputDrawingAngle";

interface Props {
  scale: SpringValue<number>;
  y: SpringValue<number>;
  angle: SpringValue<number>;
  opacity: SpringValue<number>;
}

const ANGLE_MEAS_POINTS = 6;

const WingInputAngle = ({ scale, y, angle, opacity }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const curveRef = useRef<THREE.BufferAttribute>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const material2Ref = useRef<THREE.LineBasicMaterial>(null);

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
    if (materialRef.current) {
      materialRef.current.opacity = opacity.get();
    }
    if (material2Ref.current) {
      material2Ref.current.opacity = opacity.get();
    }
  });

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
        <lineBasicMaterial ref={materialRef} color={gridColor} transparent />
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
        <lineBasicMaterial
          ref={material2Ref}
          color={gridColor}
          opacity={1}
          transparent
        />
      </animated.line>

      <AnimatedTip
        opacity={opacity}
        scale={scale}
        distance={y.to((y) => y / 2)}
      />
      <animated.mesh rotation-z={angle.to((a) => -a)}>
        <AnimatedTip
          opacity={opacity}
          scale={scale}
          distance={y.to((y) => y / 2)}
          end
        />
      </animated.mesh>

      <AnimatedHtml
        position={to([y, scale, angle], (y, scale, angle) => [
          (y / 2 + 0.35 / scale) * Math.sin(angle / 2),
          (y / 2 + 0.35 / scale) * Math.cos(angle / 2),
          0,
        ])}
        rotation-z={angle.to((angle) => -(angle / 2))}
        scale={scale.to((s) => 1 / s)}
      >
        <InputDrawingAngle value={wing.angle} setter={wing.setAngle} />
      </AnimatedHtml>
    </animated.mesh>
  );
};

export default WingInputAngle;
