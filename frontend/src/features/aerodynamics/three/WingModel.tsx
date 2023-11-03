import { SpringValue, animated } from "@react-spring/three";
import useWingModel from "./hooks/useWingModel";
import { DoubleSide } from "three";

interface Props {
  opacity: SpringValue<number>;
  shape?: number;
}

const WingModel = ({ opacity, shape }: Props) => {
  const { geometry, tipGeometry } = useWingModel(shape);

  return (
    <>
      <mesh geometry={geometry}>
        <animated.meshStandardMaterial
          color={"lightgray"}
          side={DoubleSide}
          metalness={1}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh geometry={tipGeometry}>
        <animated.meshStandardMaterial
          color={"lightgray"}
          side={DoubleSide}
          metalness={1}
          transparent
          opacity={opacity}
        />
      </mesh>
    </>
  );
};

export default WingModel;
