import React, { useEffect, useRef, useState } from "react";
import { useWingStore } from "../stores/useWing";
import AnimatedSphere from "../../power_unit/three/AnimatedSphere";
import { Sphere, TransformControls } from "@react-three/drei";
import {
  BufferGeometry,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3D,
} from "three";
import { useFrame } from "@react-three/fiber";

const Wing3D = () => {
  const wing = useWingStore();
  const [active, setActive] = useState<Mesh>(null!);
  const leadingTip = useRef<Mesh>(null);
  const trailingTip = useRef<Mesh>(null);

  const SCALE = 0.25;

  useFrame(() => {
    if (leadingTip.current && trailingTip.current) {
      active === leadingTip.current &&
        trailingTip.current.position.setY(leadingTip.current.position.y);
      active === trailingTip.current &&
        leadingTip.current.position.setY(trailingTip.current.position.y);
      wing.setSpan(parseFloat((leadingTip.current.position.y * 2).toFixed(2)));
    }
  });

  useEffect(() => {
    if (leadingTip.current && trailingTip.current) {
      leadingTip.current.position.setY(wing.span / 2);
      trailingTip.current.position.setY(wing.span / 2);
    }
  }, [wing.span]);
  return (
    <>
      <gridHelper rotation-x={Math.PI / 2} />
      <TransformControls
        position={[1, 1, 1]}
        showZ={false}
        mode="translate"
        onChange={(e) => {
          console.log(e?.target);
        }}
        object={active}
      />
      <Sphere
        ref={trailingTip}
        onClick={(e) => setActive(e.object)}
        position={[0, 0, 0]}
        scale={[SCALE, SCALE, SCALE]}
        material-color={"red"}
      />
      <Sphere
        ref={leadingTip}
        onClick={(e) => setActive(e.object)}
        position={[0, 0, 0]}
        scale={[SCALE, SCALE, SCALE]}
        material-color={"red"}
      />
      <Sphere
        position={[0, 0, 0]}
        scale={[SCALE, SCALE, SCALE]}
        material-color={"red"}
      />
      <Sphere
        position={[0, 0, 0]}
        scale={[SCALE, SCALE, SCALE]}
        material-color={"red"}
      />
    </>
  );
};

export default Wing3D;
