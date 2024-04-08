import { animated, useSpring } from "@react-spring/three";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../../../navigation/PlaneBuilder";
import { Props } from "../../../common/types/three";
import { Wing } from "../../utils/wing/Wing";

const Aileron = ({
  opacity,
  wing,
  reverse,
}: Props & { wing: Wing; reverse?: boolean }) => {
  const left = useKeyboardControls<Controls>((state) => state.left);
  const right = useKeyboardControls<Controls>((state) => state.right);

  const [spring] = useSpring(
    () => ({
      angle: (((+right - +left) * 35) / 180) * Math.PI * (reverse ? -1 : 1),
    }),
    [left, right]
  );

  const flapY = (wing.span * wing.FLAP_START) / 2;
  const flapX =
    wing.getChord(flapY) * wing.FLAP_CHORD_START + wing.getLE(flapY);

  return (
    <animated.mesh
      position-x={flapX}
      position-z={flapY}
      rotation-y={wing.getFlapAxisAngle()}
      rotation-z={spring.angle}
    >
      <mesh rotation-y={-wing.getFlapAxisAngle()}>
        <mesh geometry={wing.flap} position-x={-flapX} position-z={-flapY}>
          <animated.meshStandardMaterial
            color="white"
            metalness={0.5}
            // transparent
            // opacity={opacity}
          />
        </mesh>
      </mesh>
    </animated.mesh>
  );
};

const Ailerons = ({ opacity, wing, ...rest }: Props & { wing: Wing }) => {
  return (
    <>
      <Aileron opacity={opacity} wing={wing} reverse />
      <mesh scale-z={-1}>
        <Aileron opacity={opacity} wing={wing} />
      </mesh>
    </>
  );
};

export default Ailerons;
