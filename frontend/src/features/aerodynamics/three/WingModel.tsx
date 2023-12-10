import { SpringValue, animated } from "@react-spring/three";
import useWingModel from "./hooks/useWingModel";

interface Props {
  opacity: SpringValue<number>;
  shape?: number;
}

const WingModel = ({ opacity, shape }: Props) => {
  const { geom } = useWingModel(shape);

  return (
    <mesh geometry={geom}>
      <animated.meshStandardMaterial
        color={"lightgray"}
        metalness={1}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
};

export default WingModel;
