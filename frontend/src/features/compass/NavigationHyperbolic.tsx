import { Text, Sphere, TransformControls } from "@react-three/drei";
import { animated, SpringValue, to, useSpring } from "@react-spring/three";
import { useState } from "react";
import Inputs3D from "../common/three/Inputs3D";
import { useCompassStore } from "./stores/useCompass";
import InputSlider from "../common/inputs/InputSlider";
import AnimatedLine from "../common/three/AnimatedLine";
import AnimatedHtml from "../common/three/AnimatedHtml";

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

  const getHyperbolaCoeffs = (
    first: Record<string, number>,
    second: Record<string, number>,
    delta: number
  ) => {
    const distance = Math.sqrt(
      Math.pow(second.x - first.x, 2) + Math.pow(second.y - first.y, 2)
    );
    const e = distance / delta;
    const p = (distance / 2) * (1 - 1 / (e * e));
    return { distance, e, p };
  };

  const createHyperbola = (
    first: Record<string, number>,
    second: Record<string, number>,
    delta: number
  ) => {
    const { distance, e, p } = getHyperbolaCoeffs(first, second, delta);

    const alpha = (e * p) / (e * e - 1);
    const beta = alpha * Math.sqrt(e * e - 1);

    const hyperX = (y: number) => {
      if (1 / e === 0) return 0;
      return alpha * Math.sqrt(1 + Math.pow(y / beta, 2));
    };
    const hyper = Array.from(Array(50).keys()).map((i) => [
      hyperX((i - 25) / 10) + first.x + distance / 2,
      (i - 25) / 10 + first.y,
      0,
    ]);
    return hyper;
  };
  // const deltaRadius = 0.1;

  const hyper = createHyperbola(A, B, (2 * timedelta) / 10);
  const hyper2 = createHyperbola(A, C, (2 * ACdelta) / 10);

  const alphaAB = Math.atan2(B.y - A.y, B.x - A.x);
  const alphaAC = Math.atan2(C.y - A.y, C.x - A.x);

  const calculateIntersection = () => {
    const { e: e1, p: p1 } = getHyperbolaCoeffs(A, B, (2 * timedelta) / 10);
    const { e: e2, p: p2 } = getHyperbolaCoeffs(A, C, (2 * ACdelta) / 10);
    const a = p1 * Math.cos(alphaAC) - p2 * Math.cos(alphaAB);
    const b = p1 * Math.sin(alphaAC) - p2 * Math.sin(alphaAB);
    const c = p1 / e2 - p2 / e1;
    const d = b * Math.sqrt(a * a + b * b - c * c);
    const u1 = (a * c + d) / (a * a + b * b);
    const u2 = (a * c - d) / (a * a + b * b);
    // console.log(u1, u2);

    const getR = (p: number, e: number, u: number, alpha: number) => {
      const cos = Math.cos(alpha);
      const sin = Math.sin(alpha);
      // const r11 = p / (1 / e - Math.sqrt(1 - u1 * u1) * cos + u1 * sin);
      // const r12 = p / (1 / e - Math.sqrt(1 - u1 * u1) * cos - u1 * sin);
      // const r21 = p / (1 / e - Math.sqrt(1 - u2 * u2) * cos + u2 * sin);
      // const r22 = p / (1 / e - Math.sqrt(1 - u2 * u2) * cos - u2 * sin);
      const r11 = p / (1 / e - u1 * cos - Math.sqrt(1 - u1 * u1) * sin);
      const r12 = p / (1 / e - u1 * cos + Math.sqrt(1 - u1 * u1) * sin);
      const r21 = p / (1 / e - u2 * cos - Math.sqrt(1 - u2 * u2) * sin);
      const r22 = p / (1 / e - u2 * cos + Math.sqrt(1 - u2 * u2) * sin);
      return { r11, r12, r21, r22 };
    };
    console.log(
      {
        p1,
        p2,
      },
      {
        e1,
        e2,
      },
      {
        u1,
        u2,
      },
      {
        u1angle: (Math.acos(u1) * 180) / Math.PI,
        u2angle: (Math.acos(u2) * 180) / Math.PI,
      },
    );
    console.table([getR(p1, e1, u1, alphaAB), getR(p2, e2, u2, alphaAC)])
    const { r22 } = getR(p1, e1, u1, alphaAB);
    return { x: r22 * u2, y: r22 * Math.sqrt(1 - u2 * u2), u1, u2 };
  };
  const { x, y, u1, u2 } = calculateIntersection();

  const [towerSpring] = useSpring(
    () => ({
      rotationAB: alphaAB,
      rotationAC: alphaAC,
      Ax: A.x,
      Ay: A.y,
      ABx: (A.x + B.x) / 2 + 1.5 * Math.sin(alphaAB),
      ABy: (A.y + B.y) / 2 - 1.5 * Math.cos(alphaAB),
      ACx: (A.x + C.x) / 2 - 1.5 * Math.sin(alphaAC),
      ACy: (A.y + C.y) / 2 + 1.5 * Math.cos(alphaAC),
    }),
    [A, B, C]
  );

  return (
    <>
      {active && (
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
      )}
      <animated.mesh
        // scale={wingSpring.scale}
        // position-x={(gridPositionX * CANVAS_WIDTH) / 2}
        // rotation-x={-Math.PI / 2}
        scale={3}
      >
        <AnimatedHtml
          position-x={towerSpring.ABx}
          position-y={towerSpring.ABy}
          rotation-z={towerSpring.rotationAB}
        >
          <div className="ml-16">
            <InputSlider
              label="AB time diff"
              unit="ms"
              value={timedelta}
              min={-9}
              max={9}
              setter={setTimedelta}
            />
          </div>
        </AnimatedHtml>
        <AnimatedHtml
          position-x={towerSpring.ACx}
          position-y={towerSpring.ACy}
          rotation-z={towerSpring.rotationAC}
        >
          <div className="ml-16">
            <InputSlider
              label=""
              unit="ms"
              value={ACdelta}
              min={-9}
              max={9}
              setter={setACdelta}
            />
          </div>
        </AnimatedHtml>
        <group>
          <Sphere
            args={[0.15, 32, 32]}
            userData={{ tower: "A" }}
            onClick={(e) => setActive(e.object)}
            onPointerMissed={(e) => setActive(null)}
            position-x={A.x}
          />
          <Text
            position-x={useCompassStore.getState().A.x}
            position-y={useCompassStore.getState().A.y + 0.2}
            fontSize={0.25}
            anchorX="center"
            anchorY="bottom"
          >
            A
          </Text>
          <Sphere
            args={[0.15, 32, 32]}
            userData={{ tower: "B" }}
            onClick={(e) => setActive(e.object)}
            position-x={B.x}
          />
          <Text
            position-x={useCompassStore.getState().B.x}
            position-y={useCompassStore.getState().B.y + 0.2}
            fontSize={0.25}
            anchorX="center"
            anchorY="bottom"
          >
            B
          </Text>
          <Sphere
            args={[0.15, 32, 32]}
            userData={{ tower: "C" }}
            onClick={(e) => setActive(e.object)}
            position-x={C.x}
            position-y={C.y}
          />
          <Text
            position-x={useCompassStore.getState().C.x}
            position-y={useCompassStore.getState().C.y + 0.2}
            fontSize={0.25}
            anchorX="center"
            anchorY="bottom"
          >
            C
          </Text>
        </group>
        <Sphere
          args={[0.1, 32, 32]}
          position-x={x + B.x}
          position-y={y + B.y}
        />
        <mesh position-x={A.x} position-y={A.y}>
          <mesh rotation-z={Math.acos(u1)}>
            <AnimatedLine
              points={[
                [0, 0, 0],
                [2.5, 0, 0],
              ]}
              style="thin"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
          </mesh>
        </mesh>
        <mesh position-x={A.x} position-y={A.y}>
          <mesh rotation-z={-Math.acos(u2)}>
            <AnimatedLine
              points={[
                [0, 0, 0],
                [2, 0, 0],
              ]}
              style="thin"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
          </mesh>
        </mesh>
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
