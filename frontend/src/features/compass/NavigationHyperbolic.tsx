import { Sphere, TransformControls } from "@react-three/drei";
import { animated, SpringValue, to, useSpring } from "@react-spring/three";
import { useState } from "react";
import Inputs3D from "../common/three/Inputs3D";
import { useCompassStore } from "./stores/useCompass";
import InputSlider from "../common/inputs/InputSlider";
import AnimatedLine from "../common/three/AnimatedLine";

interface Props {
  opacity: SpringValue<number>;
}

const NavigationHyperbolic = ({ opacity }: Props) => {
  const [active, setActive] = useState<THREE.Object3D>(null!);
  const onTransform = (e: THREE.Event | undefined) => {};
  const [gizmoSpring] = useSpring(
    () => ({
      size: !!active ? 0.6 : 0,
    }),
    [active]
  );

  const AnimatedTransform = animated(TransformControls);

  const timedelta = useCompassStore((state) => state.timedelta);
  const setTimedelta = useCompassStore((state) => state.setTimedelta);

  const circleIntersection = () => {
    const posX = timedelta / 10;
    const deltaSize = 0.5;
    const xInter =
      (Math.pow(1 + posX + deltaSize, 2) - Math.pow(1 - posX + deltaSize, 2)) /
      4;
    const yInter = Math.sqrt(
      Math.pow(1 - posX + deltaSize, 2) - Math.pow(xInter - 1, 2)
    );
    const a = (xInter * xInter - posX * posX) / (yInter * yInter);
    console.log(xInter, yInter);
  };
  circleIntersection();
  const hyperbolaX = (y: number) => {
    const posX = timedelta / 10;
    const deltaSize = 0.5;
    const xInter =
      (Math.pow(1 + posX + deltaSize, 2) - Math.pow(1 - posX + deltaSize, 2)) /
      4;
    const yInter = Math.sqrt(
      Math.pow(1 - posX + deltaSize, 2) - Math.pow(xInter - 1, 2)
    );
    const a = (xInter * xInter - posX * posX) / (yInter * yInter);
    return (
      Math.sign(timedelta) *
      Math.sqrt((timedelta * timedelta) / 100 + y * y * a)
    );
  };

  const circle = Array.from(Array(40).keys()).map((i) => [
    hyperbolaX((i - 20) / 10),
    (i - 20) / 10,
    0,
  ]);

  return (
    <>
      <Inputs3D gridPositionX={-1}>
        <InputSlider
          label="Time delta"
          unit="ms"
          value={timedelta}
          min={-9}
          max={9}
          setter={setTimedelta}
        />
      </Inputs3D>
      <AnimatedTransform
        size={to(
          [gizmoSpring.size, opacity],
          (size, stepActive) => size * stepActive
        )}
        showZ={false}
        showX={active?.userData.isTrailing}
        showY={active?.userData.isTip}
        onChange={onTransform}
        object={active}
        space="local"
      />
      <animated.mesh
        // scale={wingSpring.scale}
        // position-x={(gridPositionX * CANVAS_WIDTH) / 2}
        // rotation-x={-Math.PI / 2}
        scale={3}
      >
        <animated.mesh position-x={-1}>
          <Sphere args={[0.15, 32, 32]} />
        </animated.mesh>
        <animated.mesh position-x={1}>
          <Sphere args={[0.15, 32, 32]} />
        </animated.mesh>
        <AnimatedLine
          points={circle}
          style="airstream"
          color="grid"
          opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
        />
      </animated.mesh>
    </>
  );
};

export default NavigationHyperbolic;
