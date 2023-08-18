import { SpringValue, animated } from "@react-spring/three";
import { Sphere } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";
import { Mesh } from "three";
import { useCSSColors } from "../../common/three/config";

const AnimatedSphere = animated(Sphere);

const SPHERE_SIZE = 0.25;

interface Props {
  leadingTip: React.RefObject<Mesh>;
  trailingTip: React.RefObject<Mesh>;
  trailingFuselage: React.RefObject<Mesh>;
  scale: SpringValue<number>;
  rotationZ: SpringValue<number>;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}

const WingSpheres = ({
  leadingTip,
  trailingTip,
  trailingFuselage,
  scale,
  rotationZ,
  onClick,
}: Props) => {
  const { primaryColor } =
    useCSSColors();
  return (
    <>
      <AnimatedSphere
        ref={trailingTip}
        userData={{ isTip: true, isTrailing: true }}
        onClick={onClick}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        material-color={primaryColor}
        material-transparent
        material-opacity={0.5}
      />
      <AnimatedSphere
        ref={leadingTip}
        userData={{ isTip: true, isTrailing: false }}
        onClick={onClick}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        rotation-z={rotationZ}
        material-color={primaryColor}
        material-transparent
        material-opacity={0.5}
      />
      <AnimatedSphere
        ref={trailingFuselage}
        userData={{ isFuselage: true, isTrailing: true }}
        onClick={onClick}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        material-color={primaryColor}
        material-transparent
        material-opacity={0.5}
      />
    </>
  );
};

export default WingSpheres;
