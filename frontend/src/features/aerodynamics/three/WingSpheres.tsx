import { SpringValue, animated, to } from "@react-spring/three";
import { Sphere } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";
import { Mesh } from "three";
import { useCSSColors } from "../../common/three/config";
import { useWingStore } from "../stores/useWing";

const AnimatedSphere = animated(Sphere);

const SPHERE_SIZE = 0.25;

interface Props {
  scale: SpringValue<number>;
  rotationZ: SpringValue<number>;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  chord: SpringValue<number>;
  chordTip: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
}

const WingSpheres = ({
  scale,
  rotationZ,
  onClick,
  chord,
  chordTip,
  x,
  y,
}: Props) => {
  const { primaryColor } = useCSSColors();

  return (
    <>
      <AnimatedSphere
        userData={{ isTip: true, isTrailing: false }}
        onClick={onClick}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        rotation-z={rotationZ}
        position-x={x}
        position-y={y}
        material-color={primaryColor}
        material-transparent
        material-opacity={0.5}
      />
      <AnimatedSphere
        userData={{ isTip: true, isTrailing: true }}
        onClick={onClick}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        position-x={to([x, chordTip], (x, chordTip) => x + chordTip)}
        position-y={y}
        material-color={primaryColor}
        material-transparent
        material-opacity={0.5}
      />
      <AnimatedSphere
        userData={{ isFuselage: true, isTrailing: true }}
        onClick={onClick}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        position-x={chord}
        material-color={primaryColor}
        material-transparent
        material-opacity={0.5}
      />
    </>
  );
};

export default WingSpheres;
