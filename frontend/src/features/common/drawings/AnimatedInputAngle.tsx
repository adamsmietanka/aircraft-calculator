import { useMemo, useRef } from "react";
import { useCSSColors } from "../three/config";
import { useFrame } from "@react-three/fiber";
import { SpringValue, animated, to } from "@react-spring/three";
import AnimatedTip from "./AnimatedTip";
import AnimatedHtml from "../three/AnimatedHtml";
import InputDrawingAngle from "../inputs/InputDrawingAngle";
import Formula from "../Formula";

interface Props {
  scale: SpringValue<number>;
  y: SpringValue<number>;
  angle: SpringValue<number>;
  opacity: SpringValue<number>;
  show: boolean;
}

const ANGLE_MEAS_POINTS = 15;

const WingInputAngle = ({ scale, y, angle, opacity, show }: Props) => {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const curveRef = useRef<THREE.BufferAttribute>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const material2Ref = useRef<THREE.LineBasicMaterial>(null);

  const { gridColor } = useCSSColors();

  const position = useMemo(() => {
    return new Float32Array(3 * 3);
  }, []);

  const curve = useMemo(() => {
    return new Float32Array(ANGLE_MEAS_POINTS * 3);
  }, []);

  useFrame(() => {
    const interpolatedY = y.get();
    const interpolatedScale = scale.get();
    const interpolatedAngle = angle.get();

    position.set(
      [
        0,
        interpolatedY / 2 + 0.2 / interpolatedScale,
        0,
        0,
        0,
        0,
        (interpolatedY / 2 + 0.2 / interpolatedScale) *
          Math.sin(interpolatedAngle),
        (interpolatedY / 2 + 0.2 / interpolatedScale) *
          Math.cos(interpolatedAngle),
        0,
      ],
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
    <animated.mesh rotation-z={-Math.PI / 2}>
      <animated.line>
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
      </animated.line>
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
        show={show}
        position={to([y, scale, angle], (y, scale, angle) => [
          (y / 2 - 0.15) * Math.sin(angle / 2),
          (y / 2 - 0.15) * Math.cos(angle / 2),
          0,
        ])}
        rotation-z={angle.to((angle) => -(angle / 2))}
        scale={scale.to((s) => 1 / s)}
      >
        <Formula tex="\phi" />
      </AnimatedHtml>
    </animated.mesh>
  );
};

export default WingInputAngle;
