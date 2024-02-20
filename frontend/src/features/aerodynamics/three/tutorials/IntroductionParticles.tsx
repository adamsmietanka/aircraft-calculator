import { Interpolation, animated, to, useSpring } from "@react-spring/three";
import { Props } from "../../../common/types/three";
import { useMemo, useRef } from "react";
import { CylinderGeometry, Mesh } from "three";
import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CANVAS_WIDTH, PROFILE_POSITION } from "../../../common/three/config";
import useWingScale from "../../hooks/useWingScale";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { MathUtils } from "three/src/math/MathUtils";

const TIP_SIZE = 0.02;
const BODY_SIZE = 0.04;

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

  useFrame(({ clock }, delta) => {
    const scale =
      1 + 0.2 * Math.sin((3 + 0.1 * rand) * clock.getElapsedTime() + rand);
    if (move) {
      ref.current.scale.set(scale, scale, scale);
    }
    if (center) {
      ref.current.position.set(
        MathUtils.damp(ref.current.position.x, sideLength / 2, 8, delta),
        MathUtils.damp(ref.current.position.y, -sum * 0.4 * rand, 2, delta),
        0
      );
      // ref.current.position.setZ(0.1);
    } else {
      ref.current.position.set(offset, 0, 0);
    }
  });

  return <Instance position-x={offset} ref={ref} />;
}

interface VectorsProps {
  visible?: boolean;
  amount: number;
  sum: number;
  sideLength?: number;
  opacity: Interpolation<number>;
}

const Vectors = ({
  amount,
  sum,
  sideLength = 1,
  opacity,
  ...rest
}: VectorsProps) => {
  const show = useHoverProfileStore((state) => state.airVectors);
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

  return (
    <Instances
      limit={60}
      castShadow
      receiveShadow
      geometry={vector}
      position-x={-0.25}
      {...rest}
    >
      <animated.meshBasicMaterial
        opacity={opacity}
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
  );
};

const IntroductionParticles = ({ opacity }: Props) => {
  const show = useHoverProfileStore((state) => state.airVectors);
  const upper = useHoverProfileStore((state) => state.airVectorsUpper);
  const lower = useHoverProfileStore((state) => state.airVectorsLower);

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

  const { scaleProfile } = useWingScale();

  return (
    <>
      <animated.mesh
        position-x={(PROFILE_POSITION * CANVAS_WIDTH) / 2}
        position-z={0.01}
        scale={scaleProfile}
        visible={spring.visible}
      >
        <mesh position-x={0.25} rotation-z={(-5 * Math.PI) / 180}>
          <Vectors
            amount={upper ? 60 : 50}
            sum={lower ? 0.9 : 0.55}
            opacity={to(
              [opacity, spring.opacity],
              (o, vectorsOpacity) => o * vectorsOpacity
            )}
            position-y={-0.02}
            visible={show || lower}
          />
          <Vectors
            amount={upper ? 10 : 50}
            sum={upper ? 0.2 : 0.55}
            opacity={to(
              [opacity, spring.opacity],
              (o, vectorsOpacity) => o * vectorsOpacity
            )}
            position-y={0.02}
            rotation-x={Math.PI}
            visible={show || upper}
          />
          <Vectors
            amount={2}
            sum={0.005}
            sideLength={0.04}
            opacity={to(
              [opacity, spring.opacity],
              (o, vectorsOpacity) => o * vectorsOpacity
            )}
            position-x={0.75}
            position-y={-0.02}
            rotation-z={Math.PI / 2}
            visible={show}
          />
          <Vectors
            amount={2}
            sum={0.005}
            sideLength={0.04}
            opacity={to(
              [opacity, spring.opacity],
              (o, vectorsOpacity) => o * vectorsOpacity
            )}
            position-x={-0.25}
            position-y={0.02}
            rotation-z={-Math.PI / 2}
            visible={show}
          />
        </mesh>
      </animated.mesh>
    </>
  );
};

export default IntroductionParticles;
