import { Text, Sphere, TransformControls } from "@react-three/drei";
import { animated, SpringValue, to, useSpring } from "@react-spring/three";
import { useState } from "react";
import Inputs3D from "../common/three/Inputs3D";
import { useCompassStore } from "./stores/useCompass";
import InputSlider from "../common/inputs/InputSlider";
import AnimatedLine from "../common/three/AnimatedLine";
import AnimatedHtml from "../common/three/AnimatedHtml";
import Helpers from "./Helpers";
import { CANVAS_WIDTH } from "../common/three/config";
import InputToggle from "../common/inputs/InputToggle";

interface Props {
  opacity: SpringValue<number>;
}

const HYPER_POINTS = 50;

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
  const helpers = useCompassStore((state) => state.helpers);

  const set = useCompassStore((state) => state.set);
  const setTimedelta = useCompassStore((state) => state.setTimedelta);
  const setACdelta = useCompassStore((state) => state.setACdelta);
  const setHelpers = useCompassStore((state) => state.setHelpers);

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
    const distance = Math.hypot(second.x - first.x, second.y - first.y);
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

  const arrayOpen = (from: number, to: number, size: number) =>
    Array.from(Array(size - 1).keys()).map(
      (i) => ((i + 1) / size) * (to - from) + from
    );

  const createHyperbolaNew = (
    first: Record<string, number>,
    second: Record<string, number>,
    delta: number
  ) => {
    const { e, p } = getHyperbolaCoeffs(first, second, delta);

    const radius = (p: number, e: number, phi: number) =>
      p / (1 / e + Math.cos(phi));

    const phiLim = Math.acos(-1 / e);

    const hyper = arrayOpen(-phiLim, phiLim, HYPER_POINTS).map((phi) => {
      const r = radius(p, e, phi);
      return [r * Math.cos(phi), r * Math.sin(phi), 0];
    });

    const hyper2 = arrayOpen(phiLim, 2 * Math.PI - phiLim, HYPER_POINTS).map(
      (phi) => {
        const r = radius(p, e, phi);
        return [r * Math.cos(phi), r * Math.sin(phi), 0];
      }
    );

    return [hyper, hyper2];
  };

  const hyper = createHyperbola(A, B, (2 * timedelta) / 10);
  const hyper2 = createHyperbola(A, C, (2 * ACdelta) / 10);
  const [hyper3, hyper4] = createHyperbolaNew(A, C, (2 * ACdelta) / 10);

  const alphaAB = Math.atan2(B.y - A.y, B.x - A.x);
  const alphaAC = Math.atan2(C.y - A.y, C.x - A.x);

  const areEqual = (i: number, j: number) => Math.abs((j - i) / j) < 1e-2;

  const calculateIntersection = () => {
    const { e: e1, p: p1 } = getHyperbolaCoeffs(A, B, (2 * timedelta) / 10);
    const { e: e2, p: p2 } = getHyperbolaCoeffs(A, C, (2 * ACdelta) / 10);
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

    if (areEqual(r11, r21)) return { x: r11 * u1, y: r11 * s1, ...phiAngles };
    return { x: r12 * u1, y: r12 * -s1, ...phiAngles };
  };

  const { x, y, phi1, phi2 } = calculateIntersection();

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
      <Inputs3D gridPositionX={-1.4}>
        <div className="w-48 space-y-2 -mt-8">
          <InputToggle label="Helpers" value={helpers} setter={setHelpers} />
        </div>
      </Inputs3D>
      <animated.mesh position-x={(0.25 * CANVAS_WIDTH) / 2} scale={3}>
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
        <animated.mesh position-x={towerSpring.Ax} position-y={towerSpring.Ay}>
          <Sphere args={[0.1, 32, 32]} position-x={x} position-y={y} />
          <Helpers show={helpers} phi1={phi1} phi2={phi2} opacity={opacity} />
        </animated.mesh>
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
            <AnimatedLine
              points={hyper3}
              style="airstream"
              color="red"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
            <AnimatedLine
              points={hyper4}
              style="airstream"
              color="orange"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
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
