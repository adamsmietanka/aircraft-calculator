import { TransformControls, Resize } from "@react-three/drei";
import { animated, SpringValue, to, useSpring } from "@react-spring/three";
import { useEffect, useState } from "react";
import Inputs3D from "../common/three/Inputs3D";
import { useCompassStore } from "./stores/useCompass";
import InputSlider from "../common/inputs/InputSlider";
import AnimatedLine from "../common/three/AnimatedLine";
import AnimatedHtml from "../common/three/AnimatedHtml";
import Helpers from "./Helpers";
import { CANVAS_WIDTH } from "../common/three/config";
import InputToggle from "../common/inputs/InputToggle";
import Tower from "./Tower";
import PlaneModel from "../aerodynamics/three/PlaneModel";
import Signals from "./Signals";
import AnimatedInputTechnical from "../common/drawings/AnimatedInputTechnical";
import Formula from "../common/Formula";
import AnimatedInputAngle from "../common/drawings/AnimatedInputAngle";

interface Props {
  opacity: SpringValue<number>;
}

const POLAR_POINTS = 50;
const POINTS = 70;

const NavigationHyperbolic = ({ opacity }: Props) => {
  const [active, setActive] = useState<THREE.Object3D | undefined>(null!);
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
  const directrix = useCompassStore((state) => state.directrix);
  const distances = useCompassStore((state) => state.distances);
  const DOP = useCompassStore((state) => state.DOP);

  const increaseCounter = useCompassStore((state) => state.increaseCounter);
  const setDOP = useCompassStore((state) => state.setDOP);

  const set = useCompassStore((state) => state.set);
  const setTimedelta = useCompassStore((state) => state.setTimedelta);
  const setACdelta = useCompassStore((state) => state.setACdelta);
  const setHelpers = useCompassStore((state) => state.setHelpers);
  const setDirectrix = useCompassStore((state) => state.setDirectrix);
  const setDistances = useCompassStore((state) => state.setDistances);

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
    const hyper = Array.from(Array(POINTS).keys()).map((i) => [
      hyperX((i - POINTS / 2) / 10) + first.x + distance / 2,
      (i - POINTS / 2) / 10 + first.y,
      0,
    ]);
    return hyper;
  };

  const arrayOpen = (from: number, to: number, size: number) =>
    Array.from(Array(size - 1).keys()).map(
      (i) => ((i + 1) / size) * (to - from) + from
    );

  const createHyperbolaPolar = (
    first: Record<string, number>,
    second: Record<string, number>,
    delta: number
  ) => {
    const { e, p } = getHyperbolaCoeffs(first, second, delta);

    const radius = (p: number, e: number, phi: number) =>
      p / (1 / e + Math.cos(phi));

    const phiLim = Math.acos(-1 / e);

    const hyper = arrayOpen(-phiLim, phiLim, POLAR_POINTS).map((phi) => {
      const r = radius(p, e, phi);
      return [r * Math.cos(phi), r * Math.sin(phi), 0];
    });

    const hyper2 = arrayOpen(phiLim, 2 * Math.PI - phiLim, POLAR_POINTS).map(
      (phi) => {
        const r = radius(p, e, phi);
        return [r * Math.cos(phi), r * Math.sin(phi), 0];
      }
    );

    return hyper2;
  };

  const hyper1Plus = createHyperbola(A, B, (2 * (timedelta + DOP)) / 100);
  const hyper1Minus = createHyperbola(A, B, (2 * (timedelta - DOP)) / 100);
  const hyper1PolarPlus = createHyperbolaPolar(
    A,
    B,
    (2 * (timedelta + DOP)) / 100
  );
  const hyper1PolarMinus = createHyperbolaPolar(
    A,
    B,
    (2 * (timedelta - DOP)) / 100
  );

  const hyper2Plus = createHyperbola(A, C, (2 * (ACdelta + DOP)) / 100);
  const hyper2Minus = createHyperbola(A, C, (2 * (ACdelta - DOP)) / 100);
  const hyper2PolarPlus = createHyperbolaPolar(
    A,
    C,
    (2 * (ACdelta + DOP)) / 100
  );
  const hyper2PolarMinus = createHyperbolaPolar(
    A,
    C,
    (2 * (ACdelta - DOP)) / 100
  );

  const distanceAB = Math.hypot(B.y - A.y, B.x - A.x);
  const distanceAC = Math.hypot(C.y - A.y, C.x - A.x);
  const alphaAB = Math.atan2(B.y - A.y, B.x - A.x);
  const alphaAC = Math.atan2(C.y - A.y, C.x - A.x);

  const { e: e1, p: p1 } = getHyperbolaCoeffs(A, B, (2 * timedelta) / 100);
  const { e: e2, p: p2 } = getHyperbolaCoeffs(A, C, (2 * ACdelta) / 100);

  const getDistances = (
    A: { x: number; y: number },
    B: { x: number; y: number },
    C: { x: number; y: number }
  ) => ({
    AB: Math.hypot(B.y - A.y, B.x - A.x),
    AC: Math.hypot(C.y - A.y, C.x - A.x),
  });

  const getAngles = (
    A: { x: number; y: number },
    B: { x: number; y: number },
    C: { x: number; y: number }
  ) => ({
    alphaAB: Math.atan2(B.y - A.y, B.x - A.x),
    alphaAC: Math.atan2(C.y - A.y, C.x - A.x),
  });

  const areEqual = (i: number, j: number) => Math.abs((j - i) / j) < 1e-2;

  const calculateIntersection = (
    A: { x: number; y: number },
    B: { x: number; y: number },
    C: { x: number; y: number },
    delta1: number,
    delta2: number,
    log = false
  ) => {
    const { alphaAB, alphaAC } = getAngles(A, B, C);

    const { e: e1, p: p1 } = getHyperbolaCoeffs(A, B, (2 * delta1) / 100);
    const { e: e2, p: p2 } = getHyperbolaCoeffs(A, C, (2 * delta2) / 100);

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

    if (areEqual(r11, r21))
      return { x: r11 * u1, y: r11 * s1, ...phiAngles, r: r11 };
    return { x: r12 * u1, y: r12 * -s1, ...phiAngles, r: r12 };
  };

  const { x, y, phi1, phi2, r } = calculateIntersection(
    A,
    B,
    C,
    timedelta,
    ACdelta,
    true
  );
  // const getVariance = (arr:number[][]) => arr.reduce(
  //   (a, b) => a + b,
  //   0,
  // );

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
    console.log((Math.hypot(xVar, yVar) / measStd).toPrecision(4));
  }, [A, B, C, timedelta, ACdelta]);

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
      p1,
      p2,
      phi1: -phi1,
      r,
    }),
    [A, B, C, x, y, p1, p2, phi1, r]
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

          <div className="form-control">
            <label className="label">
              <span className="label-text">Helpers</span>
            </label>
            <div className="flex flex-col">
              <InputToggle
                label="Solutions"
                value={helpers}
                setter={setHelpers}
              />
              <InputToggle
                label="Directrix"
                value={directrix}
                setter={setDirectrix}
              />
              <InputToggle
                label="Distances"
                value={distances}
                setter={setDistances}
              />
            </div>
          </div>
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
              min={-90}
              max={90}
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
              min={-90}
              max={90}
              setter={setACdelta}
            />
          </div>
        </AnimatedHtml>
        <Tower
          label="A"
          position-x={useCompassStore.getState().A.x}
          position-y={useCompassStore.getState().A.y}
          setter={setActive}
        />
        <Tower
          label="B"
          position-x={useCompassStore.getState().B.x}
          position-y={useCompassStore.getState().B.y}
          setter={setActive}
        />
        <Tower
          label="C"
          position-x={useCompassStore.getState().C.x}
          position-y={useCompassStore.getState().C.y}
          setter={setActive}
        />
        <Signals opacity={opacity} />
        <animated.mesh position-x={spring.Ax} position-y={spring.Ay}>
          <animated.mesh rotation-z={spring.rotationAB}>
            <animated.mesh
              position-x={spring.Ax.to((x) => -x)}
              position-y={spring.Ay.to((y) => -y)}
            >
              <AnimatedLine
                points={hyper1Plus}
                style="airstream"
                color="grid"
                opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
              />
              <AnimatedLine
                points={hyper1Minus}
                style="airstream"
                color="grid"
                opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
              />
            </animated.mesh>
            <AnimatedLine
              points={[
                [p1, -1.5, 0],
                [p1, 1.5, 0],
              ]}
              style="thin"
              color="grid"
              opacity={opacity.to((o) => (directrix ? o * 0.33 : 0))}
            />
            <AnimatedInputTechnical
              visible={directrix}
              distance={-2.5}
              value={p1}
              opacity={opacity.to((o) => 0.75 * o)}
            >
              p
            </AnimatedInputTechnical>

            <animated.mesh rotation-z={spring.rotationAB.to((a) => -a)}>
              <AnimatedInputAngle
                angle={spring.phi1}
                opacity={opacity.to((o) => (directrix ? 1 : 0))}
                y={opacity}
                scale={new SpringValue(3)}
                show={directrix}
              >
                <Formula tex="\phi" />
              </AnimatedInputAngle>
              <AnimatedInputAngle
                angle={spring.rotationAB.to((a) => -a)}
                opacity={opacity.to((o) => (distances || directrix ? 1 : 0))}
                y={opacity}
                scale={new SpringValue(3)}
                show={distances || directrix}
              >
                <Formula tex="\alpha" />
              </AnimatedInputAngle>
              <AnimatedLine
                points={[
                  [0, 0, 0],
                  [x, y, 0],
                ]}
                color="grid"
                opacity={opacity.to((o) => (directrix ? o * 0.33 : 0))}
              />
            </animated.mesh>
            <animated.mesh
              rotation-z={to(
                [spring.phi1, spring.rotationAB],
                (f, a) => -f - a
              )}
            >
              <AnimatedInputTechnical
                visible={directrix}
                distance={-1}
                value={r}
                opacity={opacity.to((o) => 0.75 * o)}
              >
                <div className="transform scale-[-1]">r</div>
              </AnimatedInputTechnical>
            </animated.mesh>
            <AnimatedInputTechnical
              visible={distances}
              distance={-1.5}
              value={distanceAB}
              opacity={opacity.to((o) => 0.75 * o)}
            >
              D
            </AnimatedInputTechnical>
            <AnimatedInputTechnical
              visible={distances}
              startX={distanceAB / 2}
              value={timedelta / 100}
              opacity={opacity.to((o) => 0.75 * o)}
            >
              <Formula tex={`\\frac{\\Delta}{2}`} />
            </AnimatedInputTechnical>
            <AnimatedLine
              points={[
                [distanceAB / 2, -0.25, 0],
                [distanceAB / 2, 0.25, 0],
              ]}
              style="thin"
              color="grid"
              opacity={opacity.to((o) => (distances ? o * 0.33 : 0))}
            />
            <AnimatedLine
              points={[
                [0, 0, 0],
                [distanceAB, 0, 0],
              ]}
              style="thin"
              color="grid"
              opacity={opacity.to((o) =>
                distances || directrix ? o * 0.33 : 0
              )}
            />
            {/* <AnimatedLine
              points={hyper1PolarPlus}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
            <AnimatedLine
              points={hyper1PolarMinus}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            /> */}
          </animated.mesh>
          <animated.mesh rotation-z={spring.rotationAC}>
            <animated.mesh
              position-x={spring.Ax.to((x) => -x)}
              position-y={spring.Ay.to((y) => -y)}
            >
              <AnimatedLine
                points={hyper2Plus}
                style="airstream"
                color="grid"
                opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
              />
              <AnimatedLine
                points={hyper2Minus}
                style="airstream"
                color="grid"
                opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
              />
            </animated.mesh>
            {/* <AnimatedLine
              points={hyper2PolarPlus}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            />
            <AnimatedLine
              points={hyper2PolarMinus}
              style="airstream"
              color="grid"
              opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
            /> */}
          </animated.mesh>
          <animated.mesh position-x={spring.x} position-y={spring.y}>
            <animated.mesh rotation-z={spring.rotationAB}>
              <AnimatedInputTechnical
                visible={directrix}
                value={-r * Math.cos(phi1 - alphaAB) + p1}
                opacity={opacity.to((o) => 0.75 * o)}
              >
                x
              </AnimatedInputTechnical>
            </animated.mesh>
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

export default NavigationHyperbolic;
