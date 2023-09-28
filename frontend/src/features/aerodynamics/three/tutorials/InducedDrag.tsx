import React from "react";
import useWingModel from "../hooks/useWingModel";
import { SpringValue, animated } from "@react-spring/three";
import { DoubleSide } from "three";

interface Props {
  opacity: SpringValue<number>;
}

const InducedDrag = ({ opacity }: Props) => {
  const { geometry, tipGeometry } = useWingModel(0);
  return (
    <mesh>
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
    </mesh>
  );
};

export default InducedDrag;
