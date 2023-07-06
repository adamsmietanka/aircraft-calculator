import { useEffect, useRef } from "react";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import useLinesHorizontal from "./hooks/useLinesHorizontal";
import { Html, Line } from "@react-three/drei";
import { NUMBERS_PADDING, TITLE_PADDING } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { Axis } from "./Chart2D";
import { useFrame } from "@react-three/fiber";
import AnimatedMarker from "./AnimatedMarker";

interface AxisProps {
  ticks: number[];
  axis: Axis;
  scale: number;
}

const LinesHorizontal = ({ ticks, axis, scale }: AxisProps) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const { index, starting_position, uniforms } = useLinesHorizontal(
    ticks,
    fromRef,
    toRef,
    shaderMaterialRef
  );

  const { displayMultiplier, valueMultiplier, unit } = useChartUnits(
    axis.type as string
  );

  useFrame(() => {
    if (meshRef.current && scale) {
      meshRef.current.scale.setY(scale);
    }
  });

  return (
    <>
      <mesh ref={meshRef}>

        {ticks.map((j) => (
          <AnimatedMarker y={j} type={axis.type as string} scale={[1,scale]}/>
        ))}
      </mesh>
      <Html
        className="select-none w-24"
        position={[-1.5 * TITLE_PADDING, 5, 0]}
        center
      >
        {`${axis.name} [${unit}]`}
      </Html>
    </>
  );
};

export default LinesHorizontal;
