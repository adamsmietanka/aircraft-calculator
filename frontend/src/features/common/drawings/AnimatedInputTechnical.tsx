import { to, useSpring } from "@react-spring/three";
import { ReactNode, useMemo } from "react";
import AnimatedLine from "../three/AnimatedLine";
import AnimatedTipNew from "./AnimatedTipNew";
import AnimatedHtml from "../three/AnimatedHtml";
import { VECTOR_TIP_LENGTH } from "../three/config";

interface Props {
  scale: number;
  value: number;
  valueY?: number;
  opacity: number;
  distance?: number;
  vertical?: boolean;
  outside?: boolean;
  children?: ReactNode;
}

const STICK_OUT = 0.2;

/**
 * Generic technical input in 3D. It needs to be in **world scale**.
 *
 * It will start at [0,0,0] and go to [value,0,0]
 */
const AnimatedInputTechnical = ({
  scale,
  value,
  valueY = 0,
  opacity,
  distance = 1,
  vertical = false,
  outside = false,
  children,
}: Props) => {
  const [inputSpring] = useSpring(
    () => ({
      opacity,
      scale,
      value,
    }),
    [opacity, scale, value]
  );
  console.log(scale);
  const autoOutside = outside || value * scale < 1;

  const outsideStickOut = useMemo(() => (value === 0 ? 0.75 : 1.5), [value]);

  return (
    <mesh rotation-z={vertical ? Math.PI / 2 : 0}>
      <AnimatedLine
        points={[
          [0, 0, 0],
          [0, (distance + Math.sign(distance) * STICK_OUT) / scale, 0],
          [0, distance / scale, 0],
          [
            value + (autoOutside ? outsideStickOut / scale : 0),
            distance / scale,
            0,
          ],
          [value, (distance + Math.sign(distance) * STICK_OUT) / scale, 0],
          [value, valueY, 0],
        ]}
        scale={[scale, scale, scale]}
        opacity={opacity}
        style="thin"
        color="grid"
        segments
      />
      <AnimatedTipNew
        distance={distance}
        opacity={inputSpring.opacity}
        scale={scale}
        outside={autoOutside}
      />
      <AnimatedTipNew
        distance={distance}
        opacity={inputSpring.opacity}
        scale={scale}
        value={value}
        outside={autoOutside}
      />

      <AnimatedHtml
        position={to([value, scale], (value, scale) => [
          autoOutside
            ? scale * value + (VECTOR_TIP_LENGTH + outsideStickOut) / 2
            : (scale * value) / 2,
          0.3 + distance,
          0,
        ])}
      >
        {children}
      </AnimatedHtml>
    </mesh>
  );
};

export default AnimatedInputTechnical;
