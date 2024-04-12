import { Resize, TransformControls } from "@react-three/drei";
import { animated, SpringValue, to, useSpring } from "@react-spring/three";
import { useEffect, useState } from "react";
import { useEllipseStore } from "./stores/useEllipse";
import InputSlider from "../common/inputs/InputSlider";
import AnimatedLine from "../common/three/AnimatedLine";
import AnimatedHtml from "../common/three/AnimatedHtml";
import Helpers from "./Helpers";
import Inputs3D from "../common/three/Inputs3D";
import InputToggle from "../common/inputs/InputToggle";
import { CANVAS_WIDTH } from "../common/three/config";
import Tower from "./Tower";
import PlaneModel from "../aerodynamics/three/PlaneModel";
import SignalsElliptic from "./SignalsElliptic";
import { useCompassStore } from "./stores/useCompass";
import { getAngles } from "./utils/maths";

const HYPER_POINTS = 50;

interface Props {
  opacity: SpringValue<number>;
}

const NavigationElliptic = ({ opacity }: Props) => {
  const [active, setActive] = useState<THREE.Object3D | undefined>(null!);

  const [gizmoSpring] = useSpring(
    () => ({
      size: !!active ? 0.6 : 0,
    }),
    [active]
  );

  const AnimatedTransform = animated(TransformControls);

  const timedelta = useEllipseStore((state) => state.timedelta);
  const ACdelta = useEllipseStore((state) => state.ACdelta);
  const A = useEllipseStore((state) => state.A);
  const B = useEllipseStore((state) => state.B);
  const C = useEllipseStore((state) => state.C);
  const helpers = useEllipseStore((state) => state.helpers);
  const DOP = useEllipseStore((state) => state.DOP);

  const increaseCounter = useCompassStore((state) => state.increaseCounter);

  const set = useEllipseStore((state) => state.set);
  const setTimedelta = useEllipseStore((state) => state.setTimedelta);
  const setACdelta = useEllipseStore((state) => state.setACdelta);
  const setHelpers = useEllipseStore((state) => state.setHelpers);
  const setDOP = useEllipseStore((state) => state.setDOP);

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

  const sineSpacing = (x: number) => Math.sin(x * 0.5 * Math.PI);

  const createEllipse = (
    first: Record<string, number>,
    second: Record<string, number>,
    delta: number
  ) => {
    const { e, p } = getEllipseCoeffs(first, second, delta);

    const radius = (p: number, e: number, phi: number) =>
      p / (1 / e + Math.cos(phi));

    const ellipse = Array.from(Array(HYPER_POINTS + 1).keys()).map((i) => {
      const phi = sineSpacing(i / HYPER_POINTS) * Math.PI;
      const r = radius(p, e, phi);
      return [r * Math.cos(phi), r * Math.sin(phi), 0];
    });

    const ellipseBottom = Array.from(Array(HYPER_POINTS + 1).keys()).map(
      (i) => {
        const phi = -sineSpacing(i / HYPER_POINTS) * Math.PI;
        const r = radius(p, e, phi);
        return [r * Math.cos(phi), r * Math.sin(phi), 0];
      }
    );

    return [...ellipse, ...ellipseBottom.toReversed()];
  };

  const ellipse1Plus = createEllipse(A, B, (2 * (timedelta + DOP)) / 100);
  const ellipse1Minus = createEllipse(A, B, (2 * (timedelta - DOP)) / 100);
  const ellipse1 = createEllipse(A, B, (2 * timedelta) / 100);
  const ellipse2Plus = createEllipse(A, B, (2 * (ACdelta + DOP)) / 100);
  const ellipse2Minus = createEllipse(A, B, (2 * (ACdelta - DOP)) / 100);
  const ellipse2 = createEllipse(A, C, (2 * ACdelta) / 100);

  const alphaAB = Math.atan2(B.y - A.y, B.x - A.x);
  const alphaAC = Math.atan2(C.y - A.y, C.x - A.x);

  const areEqual = (i: number, j: number) => Math.abs((j - i) / j) < 1e-2;

  const { e: e1, p: p1 } = getEllipseCoeffs(A, B, (2 * timedelta) / 100);
  const { e: e2, p: p2 } = getEllipseCoeffs(A, C, (2 * ACdelta) / 100);

  const calculateIntersection = (
    A: { x: number; y: number },
    B: { x: number; y: number },
    C: { x: number; y: number },
    delta1: number,
    delta2: number,
    log = false
  ) => {
    const { alphaAB, alphaAC } = getAngles(A, B, C);

    const { e: e1, p: p1 } = getEllipseCoeffs(A, B, (2 * delta1) / 100);
    const { e: e2, p: p2 } = getEllipseCoeffs(A, C, (2 * delta2) / 100);

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

    // console.table([
    //   {
    //     e: e1,
    //     p: p1,
    //   },
    //   {
    //     e: e2,
    //     p: p2,
    //   },
    // ]);

    log &&
      console.table([
        {
          u: u1,
          s: s1,
          alpha: (Math.atan2(s1, u1) * 180) / Math.PI,
          r1: r11,
          r2: r21,
          // c: a * u1 + b * s1,
          // delta: Math.abs((r21 - r11) / r21),
          x: areEqual(r11, r21) ? A.x + r11 * u1 : 0,
          y: areEqual(r11, r21) ? A.y + r11 * s1 : 0,
        },
        {
          u: u1,
          s: -s1,
          alpha: (Math.atan2(-s1, u1) * 180) / Math.PI,
          r1: r12,
          r2: r22,
          // c: a * u1 - b * s1,
          x: areEqual(r12, r22) ? A.x + r12 * u1 : 0,
          y: areEqual(r12, r22) ? A.y + r12 * -s1 : 0,
        },
        {
          u: u2,
          s: s2,
          alpha: (Math.atan2(s2, u2) * 180) / Math.PI,
          r1: r13,
          r2: r23,
          // c: a * u2 + b * s2,
          x: areEqual(r13, r23) ? A.x + r13 * u2 : 0,
          y: areEqual(r13, r23) ? A.y + r13 * s2 : 0,
        },
        {
          u: u2,
          s: -s2,
          alpha: (Math.atan2(-s2, u2) * 180) / Math.PI,
          r1: r14,
          r2: r24,
          // c: a * u2 - b * s2,
          x: areEqual(r14, r24) ? A.x + r14 * u2 : 0,
          y: areEqual(r14, r24) ? A.y + r14 * -s2 : 0,
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

  const { x, y, phi1, phi2 } = calculateIntersection(
    A,
    B,
    C,
    timedelta,
    ACdelta
    // true
  );

  useEffect(() => {
    set(calculateIntersection(A, B, C, timedelta, ACdelta));
    let resultX = 0;
    let resultY = 0;
    let meas = 0;
    const samples = 100;
    const err = 10;
    for (let i = 0; i < samples; i++) {
      const delta = err * (Math.random() - 0.5);
      meas += delta * delta;

      const { x: xErr, y: yErr } = calculateIntersection(
        A,
        B,
        C,
        timedelta + delta,
        ACdelta + delta
      );
      resultX += Math.pow(xErr - x, 2);
      resultY += Math.pow(yErr - y, 2);
    }
    const measStd = (Math.sqrt(meas / samples) * 2) / 100;
    const xVar = resultX / samples;
    const yVar = resultY / samples;
  }, [A, B, C, timedelta, ACdelta]);

  const [spring] = useSpring(
    () => ({
      rotationAB: alphaAB,
      rotationAC: alphaAC,
      Ax: A.x,
      Ay: A.y,
      ABx: (A.x + B.x) / 2 + 0.75 * Math.sin(alphaAB),
      ABy: (A.y + B.y) / 2 - 0.75 * Math.cos(alphaAB),
      ACx: (A.x + C.x) / 2 - 0.75 * Math.sin(alphaAC),
      ACy: (A.y + C.y) / 2 + 0.75 * Math.cos(alphaAC),
      x,
      y,
      p1,
      p2,
    }),
    [A, B, C, x, y, p1, p2]
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
          <InputSlider
            label="Time error"
            unit="μs"
            value={DOP}
            min={0}
            max={5}
            step={0.5}
            setter={setDOP}
          />
          <InputToggle label="Helpers" value={helpers} setter={setHelpers} />
          <button className="btn btn-block" onClick={() => increaseCounter()}>
            Visualize
          </button>
        </div>
      </Inputs3D>
      <animated.mesh position-x={(0.25 * CANVAS_WIDTH) / 2} scale={3.5}>
        <AnimatedHtml
          position-x={spring.ABx}
          position-y={spring.ABy}
          rotation-z={spring.rotationAB}
        >
          <div className="ml-16">
            <InputSlider
              label="AB time diff"
              unit="μs"
              value={timedelta}
              min={10}
              max={250}
              step={10}
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
              label="AC time diff"
              unit="μs"
              value={ACdelta}
              min={10}
              max={250}
              step={10}
              setter={setACdelta}
            />
          </div>
        </AnimatedHtml>
        <Tower
          label="A"
          position-x={useEllipseStore.getState().A.x}
          position-y={useEllipseStore.getState().A.y}
          setter={setActive}
        />
        <Tower
          label="B"
          position-x={useEllipseStore.getState().B.x}
          position-y={useEllipseStore.getState().B.y}
          setter={setActive}
        />
        <Tower
          label="C"
          position-x={useEllipseStore.getState().C.x}
          position-y={useEllipseStore.getState().C.y}
          setter={setActive}
        />
        <SignalsElliptic opacity={opacity} />
        <animated.mesh position-x={spring.Ax} position-y={spring.Ay}>
          <animated.mesh rotation-z={spring.rotationAB}>
            <AnimatedLine
              points={ellipse1Plus}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
            <AnimatedLine
              points={ellipse1Minus}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
          </animated.mesh>
          <animated.mesh rotation-z={spring.rotationAC}>
            <AnimatedLine
              points={ellipse2Plus}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
            <AnimatedLine
              points={ellipse2Minus}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
          </animated.mesh>
          <animated.mesh position-x={spring.x} position-y={spring.y}>
            <Resize rotation={[-Math.PI / 2, 0, 0]} scale={0.25}>
              <PlaneModel opacity={opacity} />
            </Resize>
          </animated.mesh>
          <Helpers show={helpers} phi1={phi1} phi2={phi2} opacity={opacity} />
        </animated.mesh>
      </animated.mesh>
    </>
  );
};

export default NavigationElliptic;
