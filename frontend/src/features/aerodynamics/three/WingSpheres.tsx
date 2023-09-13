import { SpringValue, animated, to, useSpring } from "@react-spring/three";
import { Sphere } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { Mesh } from "three";
import { useCSSColors } from "../../common/three/config";
import { useWingStore } from "../stores/useWing";
import { getXTip } from "./hooks/useWingSprings";
import { useProfileCamber } from "../hooks/useProfile";

const AnimatedSphere = animated(Sphere);

const SPHERE_SIZE = 0.25;

interface Props {
  scale: SpringValue<number>;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  active: THREE.Object3D;
  chord: SpringValue<number>;
  chordTip: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
  rotationZ: SpringValue<number>;
}

const WingSpheres = ({
  scale,
  onClick,
  active,
  chord,
  chordTip,
  x,
  y,
  rotationZ,
}: Props) => {
  const { primaryColor, infoColor } = useCSSColors();

  const shape = useWingStore((state) => state.shape);

  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    document.body.style.cursor = hovered > 0 ? "pointer" : "auto";
  }, [hovered]);

  return (
    <>
      <AnimatedSphere
        userData={{ isTip: true, isTrailing: false, number: 1 }}
        onClick={onClick}
        onPointerEnter={(e) => setHovered(1)}
        onPointerLeave={(e) => setHovered(0)}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        rotation-z={rotationZ}
        position-x={x}
        position-y={y}
        material-color={
          active?.userData.number === 1 || hovered === 1
            ? infoColor
            : primaryColor
        }
      />
      {shape === 1 && (
        <AnimatedSphere
          userData={{ isTip: true, isTrailing: true, number: 2 }}
          onClick={onClick}
          onPointerEnter={(e) => setHovered(2)}
          onPointerLeave={(e) => setHovered(0)}
          scale={scale.to((scale) => SPHERE_SIZE / scale)}
          position-x={to([x, chordTip], (x, chordTip) => x + chordTip)}
          position-y={y}
          material-color={
            active?.userData.number === 2 || hovered === 2
              ? infoColor
              : primaryColor
          }
          material-transparent
          material-opacity={shape === 1 ? 1 : 0}
        />
      )}
      <AnimatedSphere
        userData={{
          isFuselage: true,
          isTip: false,
          isTrailing: true,
          number: 3,
        }}
        onClick={onClick}
        onPointerEnter={(e) => setHovered(3)}
        onPointerLeave={(e) => setHovered(0)}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        position-x={chord}
        material-color={
          active?.userData.number === 3 || hovered === 3
            ? infoColor
            : primaryColor
        }
      />
    </>
  );
};

export default WingSpheres;
