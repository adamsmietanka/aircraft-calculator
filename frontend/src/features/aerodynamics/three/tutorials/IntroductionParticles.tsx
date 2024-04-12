import {
  Interpolation,
  SpringValue,
  animated,
  to,
  useSpring,
} from "@react-spring/three";
import { Props } from "../../../common/types/three";
import { useMemo, useRef } from "react";
import { CylinderGeometry, Mesh } from "three";
import { Instance, Instances, Point, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CANVAS_WIDTH,
  PROFILE_POSITION,
  useCSSColors,
} from "../../../common/three/config";
import useWingScale from "../../hooks/useWingScale";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { MathUtils } from "three/src/math/MathUtils";

const TIP_SIZE = 0.02;
const BODY_SIZE = 0.04;
const NUMBER_OF_PARTICLES = 250;
const PARTICLE_SPEED = 7e-3;

const sine = (x: number) => Math.pow(Math.sin(Math.PI * x), 0.5) / 1.5;
const abs = (x: number) => (-2 * Math.abs(x - 0.5) + 1) / 3;
const absCenter = (x: number) => (2 * Math.abs(x - 0.5)) / 3;
const sineCenter = (x: number) => (-Math.sin(Math.PI * x) + 1) / 2;
const cosineCenter = (x: number) => Math.abs(Math.cos(Math.PI * x)) / 2;
const cosine = (x: number) =>
  Math.pow(Math.abs(Math.cos(Math.PI * x)), 0.5) / 1.5;
const easeInSymmetric = (x: number) =>
  (-Math.cos(2 * Math.PI * x) / 2 + 0.5) / 1.5;

const delaySecondHalf = (x: number) => (x > 0.5 ? x - 1 : x);
const linearAsymmetric = (x: number) => (x > 0.5 ? -2 * x + 2.5 : 2 * x);
const easeOutAsymmetric = (x: number) =>
  x > 0.5 ? Math.sin(Math.PI * x) : Math.sin(Math.PI * x) + 0.5;
const asymetric = (easing: (x: number) => number, x: number) =>
  x > 0.5 ? (easing(x) + 0.3) / 1.3 : easing(x);

const yCalculated = (y: number) => (y > 0.5 ? -y + 1.5 : -y + 0.5);
const yNew = (y: number) => (y > 0.5 ? -2 * y + 2 : -2 * y + 1);
const yCalculatedAbs = (y: number) => 2 * Math.abs(y - 0.5);

const addNoise = (x: number, rand: number) => x + rand;

interface VectorProps {
  move: boolean;
  center: boolean;
  sum: number;
  offset: number;
  sideLength: number;
}
function Vector({ move, center, sum, offset, sideLength }: VectorProps) {
  const ref = useRef<Mesh>(null!);

  const rand = useMemo(() => Math.random(), []);

  const time = useRef(0);
  const flag = useRef(false);

  useFrame(({ clock }, delta) => {
    const scale =
      1 + 0.2 * Math.sin((3 + 0.1 * rand) * clock.getElapsedTime() + rand);
    if (move) {
      ref.current.scale.set(scale, scale, scale);
    }

    if (center) {
      if (!flag.current) {
        console.log(clock.getElapsedTime());
        time.current = clock.getElapsedTime();
        flag.current = true;
      }
      clock.getElapsedTime() >=
        time.current + asymetric(sine, offset) + rand / 60 &&
        ref.current.position.set(
          MathUtils.damp(ref.current.position.x, sideLength / 2, 8, delta),
          MathUtils.damp(
            ref.current.position.y,
            -sum * 0.4 * addNoise(yNew(offset), (rand - 0.5) / 10),
            8,
            delta
          ),
          0 // MathUtils.damp(ref.current.position.z, -0.01, 8, delta)
        );
      // ref.current.position.setZ(0.1);
    } else {
      ref.current.position.set(offset, 0, 0);
      flag.current = false;
    }
  });

  return <Instance position-x={offset} ref={ref} />;
}

interface VectorsProps {
  show: boolean;
  amount: number;
  sum: number;
  sideLength?: number;
  opacity: SpringValue<number>;
}

const Vectors = ({
  show,
  amount,
  sum,
  sideLength = 1,
  opacity,
  ...rest
}: VectorsProps) => {
  const center = useHoverProfileStore((state) => state.airVectorsCenter);

  const vector = useMemo(() => {
    const cyl = new CylinderGeometry(
      BODY_SIZE / 10,
      BODY_SIZE / 10,
      BODY_SIZE,
      32,
      1
    );
    const cone = new CylinderGeometry(
      0,
      BODY_SIZE / 5,
      TIP_SIZE,
      32,
      1
    ).translate(0, (BODY_SIZE + TIP_SIZE) / 2, 0);
    return BufferGeometryUtils.mergeGeometries([cyl, cone])
      .translate(0, -(BODY_SIZE / 2 + TIP_SIZE), 0)
      .scale(0.75, 0.75, 0.75);
  }, []);

  const [spring, api] = useSpring(
    () => ({
      from: { opacity: 0, visible: false },
      to: async (next) => {
        show && (await next({ visible: true }));
        await next({ opacity: show ? 1 : 0 });
        show || (await next({ visible: false }));
      },
    }),
    [show]
  );

  return (
    <animated.mesh visible={spring.visible}>
      <Instances limit={60} geometry={vector} position-x={-0.25} {...rest}>
        <animated.meshBasicMaterial
          opacity={to(
            [opacity, spring.opacity],
            (o, vectorsOpacity) => o * vectorsOpacity
          )}
          transparent
          color={"gray"}
        />
        {[...Array(amount)].map((_, i) => (
          <Vector
            key={i}
            center={center}
            sum={sum}
            move={true}
            offset={(sideLength * (i + 0.5)) / amount}
            sideLength={sideLength}
          />
        ))}
      </Instances>
    </animated.mesh>
  );
};

interface ParticleProps {
  move: boolean;
  center: boolean;
  sum: number;
  offset: number;
  sideLength: number;
}
const Particle = ({ ...rest }: ParticleProps) => {
  const ref = useRef<Mesh>(null!);

  const rand = useMemo(() => Math.random(), []);

  useFrame(({ clock }, delta) => {
    ref.current.position.set(
      ref.current.position.x + (Math.random() - 0.5) * PARTICLE_SPEED,
      ref.current.position.y + (Math.random() - 0.5) * PARTICLE_SPEED,
      0
    );
  });

  return <Instance ref={ref} {...rest} />;
};

const IntroductionParticles = ({ opacity }: Props) => {
  const show = useHoverProfileStore((state) => state.airVectors);
  const showParticles = useHoverProfileStore((state) => state.airParticles);
  const upper = useHoverProfileStore((state) => state.airVectorsUpper);
  const lower = useHoverProfileStore((state) => state.airVectorsLower);
  const flow = useHoverProfileStore((state) => state.airVectorsWithFlow);

  const [spring, api] = useSpring(
    () => ({
      from: { opacity: 0, visible: false },
      to: async (next) => {
        (show || upper || lower) && (await next({ visible: true }));
        await next({ opacity: show || upper || lower ? 1 : 0 });
        show || upper || lower || (await next({ visible: false }));
      },
    }),
    [show, upper, lower]
  );

  const [particleSpring] = useSpring(
    () => ({
      from: { opacity: 0, visible: false },
      to: async (next) => {
        showParticles && (await next({ visible: true }));
        await next({ opacity: showParticles ? 1 : 0 });
        showParticles || (await next({ visible: false }));
      },
    }),
    [showParticles]
  );

  const { scaleProfile } = useWingScale();

  const positions = useMemo(
    () =>
      Array.from(Array(NUMBER_OF_PARTICLES).keys()).map((i) => [
        1.25 * Math.random() - 0.375,
        0.7 * (Math.random() - 0.5),
        0,
      ]),
    []
  );
  const { backgroundColor } = useCSSColors();

  return (
    <>
      <mesh
        position-x={(PROFILE_POSITION * CANVAS_WIDTH) / 2}
        position-z={0.01}
        scale={scaleProfile}
      >
        <animated.mesh visible={particleSpring.visible} position-x={0.25}>
          <mesh position-z={-0.04}>
            <Instances limit={NUMBER_OF_PARTICLES}>
              <sphereGeometry />
              <animated.meshPhongMaterial
                opacity={particleSpring.opacity}
                transparent
                color={"white"}
              />
              {positions.map((pos, i) => (
                <Particle key={i} scale={0.01} position={pos} />
              ))}
            </Instances>
          </mesh>
          <mesh rotation-z={(-5 * Math.PI) / 180}>
            <mesh position-x={0.25} position-z={-0.008}>
              <planeGeometry args={[1, 0.04]} />
              <meshBasicMaterial color={backgroundColor} />
            </mesh>
          </mesh>
        </animated.mesh>
        <mesh
          position-x={0.25}
          rotation-z={(-5 * Math.PI) / 180}
          position-z={-0.01}
        >
          <Vectors
            amount={flow ? 60 : 50}
            sum={lower ? 0.9 : 0.55}
            opacity={opacity}
            position-y={-0.02}
            show={show || lower}
          />
          <Vectors
            amount={flow ? 10 : 50}
            sum={upper ? 0.2 : 0.55}
            opacity={opacity}
            position-y={0.02}
            rotation-x={Math.PI}
            show={show || upper}
          />
          <Vectors
            amount={2}
            sum={0.005}
            sideLength={0.04}
            opacity={opacity}
            position-x={0.75}
            position-y={-0.02}
            rotation-z={Math.PI / 2}
            show={show}
          />
          <Vectors
            amount={2}
            sum={0.005}
            sideLength={0.04}
            opacity={opacity}
            position-x={-0.25}
            position-y={0.02}
            rotation-z={-Math.PI / 2}
            show={show}
          />
        </mesh>
      </mesh>
    </>
  );
};

export default IntroductionParticles;
