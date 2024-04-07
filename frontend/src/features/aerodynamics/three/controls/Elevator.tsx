import { animated, useSpring } from "@react-spring/three";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../../../navigation/PlaneBuilder";
import { Props } from "../../../common/types/three";
import { Vertical } from "../../utils/wing/Vertical";

const ElevatorSide = ({
  opacity,
  stabilizer,
}: Props & { stabilizer: Vertical }) => {
  const up = useKeyboardControls<Controls>((state) => state.up);
  const down = useKeyboardControls<Controls>((state) => state.down);

  const [spring] = useSpring(
    () => ({
      angle: (((+down - +up) * 30) / 180) * Math.PI,
    }),
    [up, down]
  );

  const flapY = (stabilizer.span * stabilizer.FLAP_START) / 2;
  const flapX =
    stabilizer.getChord(flapY) * stabilizer.FLAP_CHORD_START +
    stabilizer.getLE(flapY);

  return (
    <mesh position={stabilizer.position}>
      <animated.mesh
        position-x={flapX}
        position-z={flapY}
        rotation-y={stabilizer.getFlapAxisAngle()}
        rotation-z={spring.angle}
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

const Elevator = ({
  opacity,
  stabilizer,
  ...rest
}: Props & { stabilizer: Vertical }) => {
  return (
    <>
      <ElevatorSide opacity={opacity} stabilizer={stabilizer} />
      <mesh scale-z={-1}>
        <ElevatorSide opacity={opacity} stabilizer={stabilizer} />
      </mesh>
    </>
  );
};

export default Elevator;
