import { SpringValue, animated } from "@react-spring/three";
import useWingModel from "./hooks/useWingModel";
import { DoubleSide } from "three";

interface Props {
  opacity: SpringValue<number>;
  shape?: number;
}

const WingModel = ({ opacity, shape }: Props) => {
  const { geom } = useWingModel(shape);

  return (
    <mesh geometry={geom}>
      <animated.meshStandardMaterial
        // color={"white"}
        // metalness={0.5}
        transparent
        opacity={opacity}
        side={DoubleSide}
      />
    </mesh>
  );
};

export default WingModel;
