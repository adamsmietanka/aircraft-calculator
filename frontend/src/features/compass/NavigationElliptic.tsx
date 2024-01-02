import { Text, Sphere, TransformControls } from "@react-three/drei";
import { animated, SpringValue, to, useSpring } from "@react-spring/three";
import { useState } from "react";
import { useEllipseStore } from "./stores/useEllipse";
import InputSlider from "../common/inputs/InputSlider";
import AnimatedLine from "../common/three/AnimatedLine";
import AnimatedHtml from "../common/three/AnimatedHtml";
import Helpers from "./Helpers";
import Inputs3D from "../common/three/Inputs3D";
import InputToggle from "../common/inputs/InputToggle";
import { CANVAS_WIDTH } from "../common/three/config";

interface Props {
  opacity: SpringValue<number>;
}

const HYPER_POINTS = 50;

const NavigationElliptic = ({ opacity }: Props) => {
  const [active, setActive] = useState<THREE.Object3D>(null!);
  const [gizmoSpring] = useSpring(
    () => ({
      size: !!active ? 0.6 : 0,
    }),
    [active]
  );

  const ASphere = animated(Sphere);

  const AnimatedTransform = animated(TransformControls);

  const timedelta = useEllipseStore((state) => state.timedelta);
  const ACdelta = useEllipseStore((state) => state.ACdelta);
  const A = useEllipseStore((state) => state.A);
  const B = useEllipseStore((state) => state.B);
  const C = useEllipseStore((state) => state.C);
  const helpers = useEllipseStore((state) => state.helpers);

  const set = useEllipseStore((state) => state.set);
  const setTimedelta = useEllipseStore((state) => state.setTimedelta);
  const setACdelta = useEllipseStore((state) => state.setACdelta);
  const setHelpers = useEllipseStore((state) => state.setHelpers);

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

  const getEllipseCoeffs = (
    first: Record<string, number>,
    second: Record<string, number>,
    delta: number
  ) => {
    const distance = Math.hypot(second.x - first.x, second.y - first.y);
    const e = distance / (distance + delta);
    const p = (distance / 2) * (1 - 1 / (e * e));
    return { distance, e, p };
  };

  const createEllipse = (
    first: Record<string, number>,
    second: Record<string, number>,
    delta: number
  ) => {
    const { e, p } = getEllipseCoeffs(first, second, delta);

    const radius = (p: number, e: number, phi: number) =>
      p / (1 / e + Math.cos(phi));

    const ellipse = Array.from(Array(HYPER_POINTS + 1).keys()).map((i) => {
      const phi = (i / HYPER_POINTS) * 2 * Math.PI;
      const r = radius(p, e, phi);
      return [r * Math.cos(phi), r * Math.sin(phi), 0];
    });

    return ellipse;
  };

  const ellipse1 = createEllipse(A, B, (2 * timedelta) / 10);
  const ellipse2 = createEllipse(A, C, (2 * ACdelta) / 10);

  const alphaAB = Math.atan2(B.y - A.y, B.x - A.x);
  const alphaAC = Math.atan2(C.y - A.y, C.x - A.x);

  const areEqual = (i: number, j: number) => Math.abs((j - i) / j) < 1e-2;

  const calculateIntersection = () => {
    const { e: e1, p: p1 } = getEllipseCoeffs(A, B, (2 * timedelta) / 10);
    const { e: e2, p: p2 } = getEllipseCoeffs(A, C, (2 * ACdelta) / 10);
    const a = p2 * Math.cos(alphaAB) - p1 * Math.cos(alphaAC);
    const b = p2 * Math.sin(alphaAB) - p1 * Math.sin(alphaAC);
    const c = p1 / e2 - p2 / e1;
    const d = b * Math.sqrt(a * a + b * b - c * c);
    const u1 = (a * c + d) / (a * a + b * b);
    const u2 = (a * c - d) / (a * a + b * b);
    const s1 = Math.sqrt(1 - u1 * u1);
    const s2 = Math.sqrt(1 - u2 * u2);

    const getR = (
      p: number,
      e: number,
      u: number,
      s: number,
      alpha: number
    ) => {
      const cos = Math.cos(alpha);
      const sin = Math.sin(alpha);
      return p / (1 / e + u * cos + s * sin);
    };

    const r11 = getR(p1, e1, u1, s1, alphaAB);
    const r12 = getR(p1, e1, u1, -s1, alphaAB);
    const r13 = getR(p1, e1, u2, s2, alphaAB);
    const r14 = getR(p1, e1, u2, -s2, alphaAB);

    const r21 = getR(p2, e2, u1, s1, alphaAC);
    const r22 = getR(p2, e2, u1, -s1, alphaAC);
    const r23 = getR(p2, e2, u2, s2, alphaAC);
    const r24 = getR(p2, e2, u2, -s2, alphaAC);

    console.table([
      {
        u: u1,
        s: s1,
        alpha: (Math.atan2(s1, u1) * 180) / Math.PI,
        r1: r11,
        r2: r21,
        c: a * u1 + b * s1,
        delta: Math.abs((r21 - r11) / r21),
      },
      {
        u: u1,
        s: -s1,
        alpha: (Math.atan2(-s1, u1) * 180) / Math.PI,
        r1: r12,
        r2: r22,
        c: a * u1 - b * s1,
      },
      {
        u: u2,
        s: s2,
        alpha: (Math.atan2(s2, u2) * 180) / Math.PI,
        r1: r13,
        r2: r23,
        c: a * u2 + b * s2,
      },
      {
        u: u2,
        s: -s2,
        alpha: (Math.atan2(-s2, u2) * 180) / Math.PI,
        r1: r14,
        r2: r24,
        c: a * u2 - b * s2,
      },
    ]);

    // extract phi angles of solutions
    let phiAngles = { phi1: 0, phi2: 0 };
    if (areEqual(r11, r21))
      phiAngles = { ...phiAngles, phi1: Math.atan2(s1, u1) };
    if (areEqual(r12, r22))
      phiAngles = { ...phiAngles, phi1: Math.atan2(-s1, u1) };
    if (areEqual(r13, r23))
      phiAngles = { ...phiAngles, phi2: Math.atan2(s2, u2) };
    if (areEqual(r14, r24))
      phiAngles = { ...phiAngles, phi2: Math.atan2(-s2, u2) };

    if (areEqual(r13, r23)) return { x: r13 * u2, y: r13 * s2, ...phiAngles };
    return { x: r14 * u2, y: r14 * -s2, ...phiAngles };
  };

  const { x, y, phi1, phi2 } = calculateIntersection();

  const [spring] = useSpring(
    () => ({
      rotationAB: alphaAB,
      rotationAC: alphaAC,
      Ax: A.x,
      Ay: A.y,
      ABx: (A.x + B.x) / 2 + 1.5 * Math.sin(alphaAB),
      ABy: (A.y + B.y) / 2 - 1.5 * Math.cos(alphaAB),
      ACx: (A.x + C.x) / 2 - 1.5 * Math.sin(alphaAC),
      ACy: (A.y + C.y) / 2 + 1.5 * Math.cos(alphaAC),
      x,
      y,
    }),
    [A, B, C, x, y]
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
      <Inputs3D gridPositionX={-1.4}>
        <div className="w-48 space-y-2 -mt-8">
          <InputToggle label="Helpers" value={helpers} setter={setHelpers} />
        </div>
      </Inputs3D>
      <animated.mesh position-x={(0.25 * CANVAS_WIDTH) / 2} scale={3}>
        <AnimatedHtml
          position-x={spring.ABx}
          position-y={spring.ABy}
          rotation-z={spring.rotationAB}
        >
          <div className="ml-16">
            <InputSlider
              label="AB time diff"
              unit="ms"
              value={timedelta}
              min={1}
              max={9}
              setter={setTimedelta}
            />
          </div>
        </AnimatedHtml>
        <AnimatedHtml
          position-x={spring.ACx}
          position-y={spring.ACy}
          rotation-z={spring.rotationAC}
        >
          <div className="ml-16">
            <InputSlider
              label=""
              unit="ms"
              value={ACdelta}
              min={1}
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
            position-x={useEllipseStore.getState().A.x}
            position-y={useEllipseStore.getState().A.y + 0.2}
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
            position-x={useEllipseStore.getState().B.x}
            position-y={useEllipseStore.getState().B.y + 0.2}
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
            position-x={useEllipseStore.getState().C.x}
            position-y={useEllipseStore.getState().C.y + 0.2}
            fontSize={0.25}
            anchorX="center"
            anchorY="bottom"
          >
            C
          </Text>
        </group>
        <animated.mesh position-x={spring.Ax} position-y={spring.Ay}>
          <ASphere
            args={[0.1, 32, 32]}
            position-x={spring.x}
            position-y={spring.y}
          />
          <Helpers show={helpers} phi1={phi1} phi2={phi2} opacity={opacity} />
        </animated.mesh>
        <animated.mesh position-x={spring.Ax} position-y={spring.Ay}>
          <animated.mesh rotation-z={spring.rotationAB}>
            <AnimatedLine
              points={ellipse1}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
          </animated.mesh>
          <animated.mesh rotation-z={spring.rotationAC}>
            <AnimatedLine
              points={ellipse2}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
          </animated.mesh>
        </animated.mesh>
      </animated.mesh>
    </>
  );
};

export default NavigationElliptic;
