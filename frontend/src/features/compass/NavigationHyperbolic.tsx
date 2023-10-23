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
  const [gizmoSpring] = useSpring(
    () => ({
      size: !!active ? 0.6 : 0,
    }),
    [active]
  );

  const AnimatedTransform = animated(TransformControls);

  const timedelta = useCompassStore((state) => state.timedelta);
  const ACdelta = useCompassStore((state) => state.ACdelta);
  const A = useCompassStore((state) => state.A);
  const B = useCompassStore((state) => state.B);
  const C = useCompassStore((state) => state.C);
  const set = useCompassStore((state) => state.set);
  const setTimedelta = useCompassStore((state) => state.setTimedelta);
  const setACdelta = useCompassStore((state) => state.setACdelta);

  const onTransform = (e: THREE.Event | undefined) => {
    if (e && e.target.object) {
      const { tower } = e.target.object.userData;
      const { x, y } = e.target.object.position;
      if (tower === "A") {
        set({ A: { x, y } });
      }
      if (tower === "B") {
        set({ B: { x, y } });
      }
      if (tower === "C") {
        set({ C: { x, y } });
      }
    }
  };

  const circle = Array.from(Array(41).keys()).map((i) => [
    Math.cos((i / 20) * Math.PI),
    Math.sin((i / 20) * Math.PI),
    0,
  ]);

  const createHyperbola = (
    first: Record<string, number>,
    second: Record<string, number>,
    delta: number
  ) => {
    const distance12 = Math.sqrt(
      Math.pow(second.x - first.x, 2) + Math.pow(second.y - first.y, 2)
    );
    const e = distance12 / delta;
    const p = (distance12 / 2) * (1 - 1 / (e * e));

    const alpha = (e * p) / (e * e - 1);
    const beta = alpha * Math.sqrt(e * e - 1);

    const hyperX = (y: number) => {
      if (1 / e === 0) return 0;
      return alpha * Math.sqrt(1 + Math.pow(y / beta, 2));
    };
    const hyper = Array.from(Array(40).keys()).map((i) => [
      hyperX((i - 20) / 10) + first.x + distance12 / 2,
      (i - 20) / 10 + first.y,
      0,
    ]);
    return hyper;
  };
  // const deltaRadius = 0.1;

  const hyper = createHyperbola(A, B, (2 * timedelta) / 10);
  const hyper2 = createHyperbola(A, C, (2 * ACdelta) / 10);
  const [towerSpring] = useSpring(
    () => ({
      rotationAB: Math.atan2(B.y - A.y, B.x - A.x),
      rotationAC: Math.atan2(C.y - A.y, C.x - A.x),
      Ax: A.x,
      Ay: A.y,
    }),
    [A, B, C]
  );

  return (
    <>
      <Inputs3D gridPositionX={-1}>
        <InputSlider
          label="AB time diff"
          unit="ms"
          value={timedelta}
          min={-9}
          max={9}
          setter={setTimedelta}
        />
        <InputSlider
          label="AC time diff"
          unit="ms"
          value={ACdelta}
          min={-9}
          max={9}
          setter={setACdelta}
        />
      </Inputs3D>
      <AnimatedTransform
        size={to(
          [gizmoSpring.size, opacity],
          (size, stepActive) => size * stepActive
        )}
        showZ={false}
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
        <Sphere
          args={[0.15, 32, 32]}
          userData={{ tower: "A" }}
          onClick={(e) => setActive(e.object)}
          position-x={A.x}
        />
        <Sphere
          args={[0.15, 32, 32]}
          userData={{ tower: "B" }}
          onClick={(e) => setActive(e.object)}
          position-x={B.x}
        />
        <Sphere
          args={[0.15, 32, 32]}
          userData={{ tower: "C" }}
          onClick={(e) => setActive(e.object)}
          position-x={C.x}
          position-y={C.y}
        />
        <animated.mesh position-x={towerSpring.Ax} position-y={towerSpring.Ay}>
          <animated.mesh rotation-z={towerSpring.rotationAB}>
            <animated.mesh
              position-x={towerSpring.Ax.to((x) => -x)}
              position-y={towerSpring.Ay.to((y) => -y)}
            >
              <AnimatedLine
                points={hyper}
                style="airstream"
                color="grid"
                opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
              />
            </animated.mesh>
          </animated.mesh>
          <animated.mesh rotation-z={towerSpring.rotationAC}>
            <animated.mesh
              position-x={towerSpring.Ax.to((x) => -x)}
              position-y={towerSpring.Ay.to((y) => -y)}
            >
              <AnimatedLine
                points={hyper2}
                style="airstream"
                color="grid"
                opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
              />
            </animated.mesh>
          </animated.mesh>
        </animated.mesh>
        {/* <animated.mesh position-x={-1} scale={1 + delta12 / 2 + deltaRadius}>
          <AnimatedLine
            points={circle}
            style="thin"
            color="grid"
            opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
          />
        </animated.mesh>
        <animated.mesh position-x={1} scale={1 - delta12 / 2 + deltaRadius}>
          <AnimatedLine
            points={circle}
            style="thin"
            color="grid"
            opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
          />
        </animated.mesh> */}
      </animated.mesh>
    </>
  );
};

export default NavigationHyperbolic;
