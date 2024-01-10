import { useCursor, Text } from "@react-three/drei";
import { useState } from "react";
import { Object3D } from "three";
import { useCSSColors } from "../common/three/config";

interface TowerProps {
  label: string;
  setter: (value: Object3D | undefined) => void;
}
const Tower = ({ label, setter, ...props }: TowerProps) => {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  const { gridColor } = useCSSColors();

  return (
    <mesh
      {...props}
      userData={{ tower: label }}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={(e) => setHover(false)}
      onClick={(e) => setter(e.object)}
      onPointerMissed={(e) => setter(undefined)}
    >
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshBasicMaterial color={hovered ? "gray" : gridColor} />
      <Text
        position-y={0.2}
        fontSize={0.25}
        anchorX="center"
        anchorY="bottom"
        color={gridColor}
      >
        {label}
      </Text>
    </mesh>
  );
};

export default Tower;
