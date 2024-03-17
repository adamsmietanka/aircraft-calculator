import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Interpolation, SpringValue, useSpring } from "@react-spring/three";
import { Line2, LineSegments2, LineMaterialParameters } from "three-stdlib";

import { useCSSColors } from "./config";
import { styles } from "./utils/lineStyles";
import {
  BufferGeometry,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute,
  Vector3,
} from "three";
import useConfig from "../subtitles/hooks/useConfig";

type Props = {
  points: number[][];
  scale?: number[];
  opacity?: number | SpringValue<number> | Interpolation<number>;
  offset?: number;
  width?: SpringValue<number> | number;
  color?: string;
  style?: string;
  segments?: boolean;
} & Omit<LineMaterialParameters, "opacity" | "color" | "vertexColors">;

const AnimatedLine = ({
  points,
  scale,
  opacity = 1,
  offset = 0,
  width = 3,
  color = "primary",
  style = "normal",
  segments = false,
  ...rest
}: Props) => {
  const { colors } = useCSSColors();

  const lineRef = useRef<Line2 | LineSegments2>(null!);

  const worldScale = useMemo(() => new Vector3(), []);

  const { customConfig } = useConfig();

  const [lineSpring] = useSpring(
    () => ({
      points: points.flat(),
      opacity,
      width: styles[style]?.width || width,
      offset: offset,
      config: customConfig,
    }),
    [points, opacity, width, offset, worldScale, customConfig]
  );

  useFrame((state, delta) => {
    worldScale.setFromMatrixScale(lineRef.current.matrixWorld);
    lineRef.current.geometry.setPositions(lineSpring.points.get());
    computeLineDistancesScaled(lineRef.current.geometry, worldScale);

    lineRef.current.material.opacity = lineSpring.opacity.get();
    lineRef.current.material.linewidth = lineSpring.width.get();
    lineRef.current.material.dashOffset -= lineSpring.offset.get() * delta * 60;
  });

  const _start = useMemo(() => new Vector3(), []);
  const _end = useMemo(() => new Vector3(), []);

  const distanceScaled = (start: Vector3, end: Vector3, scale: Vector3) => {
    const dx = (start.x - end.x) * scale.x,
      dy = (start.y - end.y) * scale.y,
      dz = (start.z - end.z) * scale.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  const computeLineDistancesScaled = (
    geometry: BufferGeometry,
    scale: Vector3
  ) => {
    const instanceStart = geometry.attributes.instanceStart;
    const instanceEnd = geometry.attributes.instanceEnd;
    const lineDistances = new Float32Array(2 * instanceStart.count);

    for (let i = 0, j = 0, l = instanceStart.count; i < l; i++, j += 2) {
      _start.fromBufferAttribute(instanceStart, i);
      _end.fromBufferAttribute(instanceEnd, i);

      lineDistances[j] = j === 0 ? 0 : lineDistances[j - 1];
      lineDistances[j + 1] =
        lineDistances[j] + distanceScaled(_start, _end, scale);
    }

    const instanceDistanceBuffer = new InstancedInterleavedBuffer(
      lineDistances,
      2,
      1
    ); // d0, d1

    geometry.setAttribute(
      "instanceDistanceStart",
      new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0)
    ); // d0
    geometry.setAttribute(
      "instanceDistanceEnd",
      new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1)
    ); // d1
  };

  return (
    <Line
      ref={lineRef}
      dashed
      points={[0, 0, 0, 1, 0, 0]}
      color={colors[color] || color}
      segments={segments}
      transparent
      {...styles[style]}
      {...rest}
    />
  );
};

export default AnimatedLine;
