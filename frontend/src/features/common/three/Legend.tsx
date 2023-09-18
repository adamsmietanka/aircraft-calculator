import { animated } from "@react-spring/three";
import { CANVAS_WIDTH } from "../../common/three/config";
import { Text } from "@react-three/drei";
import AnimatedLine from "./AnimatedLine";

interface Props {
  gridPositionX: number;
  items: Array<Record<string, string>>;
}

const Legend = ({ gridPositionX, items }: Props) => {
  return (
    <animated.mesh
      position-x={(gridPositionX * CANVAS_WIDTH) / 2}
      position-y={items.length / 2}
    >
      {items.map((i, index) => (
        <>
          <AnimatedLine
            points={[
              [0, 0 - index, 0],
              [0.75, 0 - index, 0],
            ]}
            style={i.style}
            color={i.color}
          />
          <Text fontSize={0.4} position={[1, -index, 0]} anchorX="left">
            {i.name}
          </Text>
        </>
      ))}
    </animated.mesh>
  );
};

export default Legend;
