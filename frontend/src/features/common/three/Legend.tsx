import { animated } from "@react-spring/three";
import {
  CANVAS_WIDTH,
  useCSSColors,
} from "../../common/three/config";
import { Text } from "@react-three/drei";

interface Props {
  size: number[];
  gridPositionX: number;
  items: Array<Record<string, string>>;
}

const Legend = ({ size, gridPositionX, items }: Props) => {
  const styles: Record<string, Record<string, number>> = {
    dotted: { array: 0.1, width: 0.75 },
    thin: { array: 0.25, width: 0.4 },
  };

  const { colors } = useCSSColors();

  return (
    <animated.mesh
      position-x={(gridPositionX * size[0] * CANVAS_WIDTH) / 2}
      position-y={items.length / 2}
    >
      {items.map((i, index) => (
        <mesh>
          <meshLineGeometry points={[0, 0 - index, 0, 0.5, 0 - index, 0]} />
          <meshLineMaterial
            dashArray={styles[i.style]?.array || 1}
            dashRatio={i.style ? 0.5 : 0}
            transparent
            lineWidth={(styles[i.style]?.width || 1) * 0.1}
            color={colors[i.color || "primary"] || i.color}
          />
          <Text
            fontSize={0.4}
            position={[0.75, -index, 0]}
            anchorX="left"
          >
            {i.name}
          </Text>
        </mesh>
      ))}
    </animated.mesh>
  );
};

export default Legend;
