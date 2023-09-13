import { SpringValue, animated, to, useSpring } from "@react-spring/three";
import { Sphere } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";
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
  chord: SpringValue<number>;
  chordTip: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
  stepOpacity: SpringValue<number>;
}

const WingSpheres = ({
  scale,
  onClick,
  x,
  y,
  stepOpacity,
}: Props) => {
  const { primaryColor } = useCSSColors();

  const chordTip = useWingStore((state) => state.chordTip);
  const chord = useWingStore((state) => state.chord);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);

  const shape = useWingStore((state) => state.shape);

  const { F } = useProfileCamber();

  const [sphereSpring] = useSpring(() => {
    if (shape === 0)
      return {
        x: 0,
        rotationZ: 0,
      };
    if (shape === 1)
      return {
        x: getXTip(angle, span),
        rotationZ: (-angle * Math.PI) / 180,
      };
    return {
      x: chord * F,
      rotationZ: 0,
    };
  }, [span, angle, chord, chordTip, shape]);

  return (
    <>
      <AnimatedSphere
        userData={{ isTip: true, isTrailing: false }}
        onClick={onClick}
        onPointerMove={() => console.log(1)}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        rotation-z={sphereSpring.rotationZ}
        position-x={x}
        position-y={y}
        material-color={primaryColor}
        material-transparent
        material-opacity={stepOpacity}
      />
      {shape === 1 && (
        <AnimatedSphere
          userData={{ isTip: true, isTrailing: true }}
          onClick={onClick}
          scale={scale.to((scale) => SPHERE_SIZE / scale)}
          position-x={to([x, chordTip], (x, chordTip) => x + chordTip)}
          position-y={y}
          material-color={primaryColor}
          material-transparent
          material-opacity={stepOpacity}
        />
      )}
      <AnimatedSphere
        userData={{ isFuselage: true, isTrailing: true }}
        onClick={onClick}
        scale={scale.to((scale) => SPHERE_SIZE / scale)}
        position-x={chord}
        material-color={primaryColor}
        material-transparent
        material-opacity={stepOpacity}
      />
    </>
  );
};

export default WingSpheres;
