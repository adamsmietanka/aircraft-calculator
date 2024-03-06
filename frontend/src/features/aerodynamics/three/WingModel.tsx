import { SpringValue, animated, useSpring } from "@react-spring/three";
import { DoubleSide } from "three";
import { useEffect, useState } from "react";
import { Wing } from "../utils/wing/Wing";
import { useWingStore } from "../stores/useWing";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../../navigation/PlaneBuilder";

interface Props {
  opacity: SpringValue<number>;
  shape?: number;
}

const Flap = ({
  opacity,
  wing,
  reverse,
}: Props & { wing: any; reverse?: boolean }) => {
  const left = useKeyboardControls<Controls>((state) => state.left);
  const right = useKeyboardControls<Controls>((state) => state.right);

  const span = useWingStore((state) => state.span);

  const [spring] = useSpring(
    () => ({
      angle: (((+right - +left) * 35) / 180) * Math.PI * (reverse ? -1 : 1),
    }),
    [left, right]
  );

  const flapY = (span * wing.FLAP_START) / 2;
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
            transparent
            opacity={opacity}
          />
        </mesh>
      </mesh>
    </animated.mesh>
  );
};

const WingModel = ({ opacity }: Props) => {
  const profile = useWingStore((state) => state.profile);
  const chord = useWingStore((state) => state.chord);
  const span = useWingStore((state) => state.span);
  const angle = useWingStore((state) => state.angle);
  const chordTip = useWingStore((state) => state.chordTip);
  const shape = useWingStore((state) => state.shape);

  const [wing, setWing] = useState<Wing>(new Wing({}, "10"));

  useEffect(() => {
    const config = {
      span,
      chord,
      chordTip,
      angle,
      shape,
    };

    const wing = new Wing(config, profile);
    wing.FLAP_START = 0.5;
    wing.FLAP_END = 0.95;

    wing.createModel();
    wing.createFlap();

    setWing(wing);
  }, [span, chord, chordTip, angle, shape, profile]);

  return (
    <mesh>
      <mesh geometry={wing.geometry}>
        <animated.meshStandardMaterial
          transparent
          opacity={opacity}
          side={DoubleSide}
        />
      </mesh>
      <Flap opacity={opacity} wing={wing} reverse />
      <mesh scale-z={-1}>
        <Flap opacity={opacity} wing={wing} />
      </mesh>
    </mesh>
  );
};

export default WingModel;
