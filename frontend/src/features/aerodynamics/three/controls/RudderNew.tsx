import { animated, useSpring } from "@react-spring/three";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../../../navigation/PlaneBuilder";
import { Props } from "../../../common/types/three";
import { Vertical } from "../../utils/wing/Vertical";

const RudderNew = ({
  opacity,
  stabilizer,
  ...rest
}: Props & { stabilizer: Vertical }) => {
  const left = useKeyboardControls<Controls>((state) => state.left);
  const right = useKeyboardControls<Controls>((state) => state.right);

  const [spring] = useSpring(
    () => ({
      angle: (((+right - +left) * 35) / 180) * Math.PI,
    }),
    [left, right]
  );

  const flapY = (stabilizer.span * stabilizer.FLAP_START) / 2;
  const flapX =
    stabilizer.getChord(flapY) * stabilizer.FLAP_CHORD_START +
    stabilizer.getLE(flapY);

  return (
    <mesh position={stabilizer.position} rotation-x={-Math.PI / 2}>
      <animated.mesh
        position-x={flapX}
        position-z={flapY}
        rotation-y={stabilizer.getFlapAxisAngle()}
        rotation-z={spring.angle}
        {...rest}
      >
        <mesh rotation-y={-stabilizer.getFlapAxisAngle()}>
          <mesh
            geometry={stabilizer.flap}
            position-x={-flapX}
            position-z={-flapY}
          >
            <animated.meshStandardMaterial
              color="white"
              metalness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
        </mesh>
      </animated.mesh>
    </mesh>
  );
};

export default RudderNew;
