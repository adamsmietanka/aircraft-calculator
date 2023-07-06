import { useRef } from "react";
import vertex from "./shaders/line.vertex.glsl";
import fragment from "./shaders/line.fragment.glsl";
import useLinesVertical from "./hooks/useLinesVertical";
import { Text } from "@react-three/drei";
import { NUMBERS_PADDING, TITLE_PADDING } from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import { Axis } from "./Chart2D";
import { useFrame, useThree } from "@react-three/fiber";

interface AxisProps {
  ticks: number[];
  axis: Axis;
  scale: number;
}

const LinesVertical = ({ ticks, axis, scale, ...props }: AxisProps) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const fromRef = useRef<THREE.BufferAttribute>(null);
  const toRef = useRef<THREE.BufferAttribute>(null);

  const textRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const { index, starting_position, uniforms } = useLinesVertical(
    ticks,
    fromRef,
    toRef,
    shaderMaterialRef
  );

  const { displayMultiplier, valueMultiplier, unit } = useChartUnits(
    axis.type as string
  );

  const { clock } = useThree();
  console.log(clock.getElapsedTime());

  useFrame(({ clock }) => {
    if (meshRef.current && scale) {
      meshRef.current.scale.setY(scale);
    }
    if (textRef.current) {
      // console.log(textRef);
      textRef.current.children.forEach((c, index) => {
        c.visible = clock.getElapsedTime() > 1 + index * 0.1;
      });
    }
  });

  return (
    <group {...props}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={fromRef}
            attach="attributes-positionFrom"
            count={starting_position.length / 3}
            array={starting_position.slice()}
            itemSize={3}
          />
          <bufferAttribute
            ref={toRef}
            attach="attributes-position"
            count={starting_position.length / 3}
            array={starting_position}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-index"
            array={index}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderMaterialRef}
          // blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
        />
      </lineSegments>
      <group ref={textRef}>
        {ticks.map((i) => (
          <Text
            key={i}
            fontSize={0.4}
            position={[i * valueMultiplier, -NUMBERS_PADDING, 0]}
            fillOpacity={0.5}
          >
            {i * displayMultiplier}
          </Text>
        ))}
        <Text position={[7.5, -TITLE_PADDING, 0]} fontSize={0.5}>
          {`${axis.name} [${unit}]`}
        </Text>
      </group>
    </group>
  );
};

export default LinesVertical;
