import { SpringValue, animated } from "@react-spring/three";
import { CANVAS_WIDTH, useCSSColors } from "../../common/three/config";
import { Text } from "@react-three/drei";
import AnimatedLine from "./AnimatedLine";

interface Props {
  gridPositionX: number;
  items: Array<Record<string, string>>;
  opacity: SpringValue<number>;
}

const Legend = ({ gridPositionX, items, opacity }: Props) => {
  const { gridColor } = useCSSColors();
  const AnimatedText = animated(Text);
  return (
    <animated.mesh
      position-x={(gridPositionX * CANVAS_WIDTH) / 2}
      position-y={items.length / 2}
    >
      {items.map((i, index) => (
        <mesh key={index}>
          <AnimatedLine
            points={[
              [0, 0 - index, 0],
              [0.75, 0 - index, 0],
            ]}
            style={i.style}
            color={i.color}
            opacity={opacity}
          />
          <AnimatedText
            fontSize={0.4}
            position={[1, -index, 0]}
            anchorX="left"
            color={gridColor}
            fillOpacity={opacity}
          >
            {i.name}
          </AnimatedText>
        </mesh>
      ))}
    </animated.mesh>
  );
};

export default Legend;
