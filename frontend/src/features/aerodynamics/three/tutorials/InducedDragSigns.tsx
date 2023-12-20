import { animated, to, useSpring } from "@react-spring/three";
import { useInducedDragStore } from "./stores/useInducedDrag";
import { Props } from "../../../common/types/three";
import { useEffect, useMemo, useRef } from "react";
import {
  CubicBezierCurve3,
  CurvePath,
  CylinderGeometry,
  LineCurve3,
  Mesh,
  Vector,
  Vector3,
} from "three";
import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const NUMBER_OF_SIGNS = 15;
const SIGN_SPEED = 7e-4;

interface SignProps {
  move: boolean;
  offset: number;
  curve: CurvePath<Vector>;
}
function Sign({ move, offset, curve }: SignProps) {
  const ref = useRef<Mesh>(null!);

  useEffect(() => {
    curve.getPoint(offset % 1, ref.current.position);
  }, []);

  useFrame(() => {
    if (move) {
      offset += SIGN_SPEED;
      curve.getPoint(offset % 1, ref.current.position);
    }
  });

  return <Instance rotation-y={Math.PI / 4} ref={ref} />;
}
function Vertical({ move, offset, curve }: SignProps) {
  const ref = useRef<Mesh>(null!);

  useEffect(() => {
    curve.getPoint(offset % 0.5, ref.current.position);
  }, []);

  useFrame(() => {
    if (move) {
      offset += SIGN_SPEED;
      curve.getPoint(offset % 0.5, ref.current.position);
    }
  });

  return <Instance ref={ref} />;
}

const InducedDragSigns = ({ opacity }: Props) => {
  const show = useInducedDragStore((state) => state.signs);
  const move = useInducedDragStore((state) => state.moveSigns);

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

  const curve = useMemo(() => {
    const line1 = new LineCurve3(
      new Vector3(0, -0.1, 0),
      new Vector3(0, -0.1, 1)
    );
    const line2 = new LineCurve3(
      new Vector3(0, 0.1, 1),
      new Vector3(0, 0.1, 0)
    );
    const curve = new CubicBezierCurve3(
      new Vector3(0, -0.1, 1),
      new Vector3(0, -0.1, 1 + 4 / 30),
      new Vector3(0, 0.1, 1 + 4 / 30),
      new Vector3(0, 0.1, 1)
    );
    const path = new CurvePath();
    path.add(line1);
    path.add(curve);
    path.add(line2);
    return path;
  }, []);

  const cylinder = useMemo(() => {
    const geom2 = new CylinderGeometry(5e-3, 5e-3, 0.05, 32, 1).rotateZ(
      Math.PI / 2
    );
    return geom2;
  }, []);

  return (
    <>
      <mesh position-x={0.5}>
        <Instances
          limit={Math.ceil(NUMBER_OF_SIGNS / 2)}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[5e-3, 5e-3, 0.05, 32, 1]} />
          <animated.meshBasicMaterial
            visible={show}
            opacity={to(
              [opacity, spring.opacity],
              (o, tunnelOpacity) => o * tunnelOpacity
            )}
            transparent
            color={"gray"}
          />
          {[...Array(NUMBER_OF_SIGNS + 1)].map((_, i) => (
            <Vertical
              key={i}
              move={move}
              offset={i / NUMBER_OF_SIGNS}
              curve={curve}
            />
          ))}
        </Instances>
        <Instances
          limit={NUMBER_OF_SIGNS}
          castShadow
          receiveShadow
          geometry={cylinder}
        >
          <animated.meshBasicMaterial
            visible={show}
            opacity={to(
              [opacity, spring.opacity],
              (o, tunnelOpacity) => o * tunnelOpacity
            )}
            transparent
            color={"gray"}
          />
          {[...Array(NUMBER_OF_SIGNS + 1)].map((_, i) => (
            <Sign
              key={i}
              move={move}
              offset={i / NUMBER_OF_SIGNS}
              curve={curve}
            />
          ))}
        </Instances>
      </mesh>
    </>
  );
};

export default InducedDragSigns;
