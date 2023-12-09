import { SpringValue, animated, useSpring } from "@react-spring/three";
import { useWingStore } from "../stores/useWing";
import { getXTip } from "./hooks/useWingSpring";
import AnimatedLine from "../../common/three/AnimatedLine";
import { useProfileStore } from "../stores/useProfile";
import useProfileCamber from "../hooks/useProfileCamber";

interface Props {
  opacity: SpringValue<number>;
}

const ProfileOutlines = ({ opacity }: Props) => {
  const chordTip = useWingStore((state) => state.chordTip);
  const chord = useWingStore((state) => state.chord);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);
  const shape = useWingStore((state) => state.shape);

  const profilePoints = useProfileStore((state) => state.profile);
  const { F } = useProfileCamber();

  const [profileSpring] = useSpring(() => {
    if (shape === 0)
      return {
        positionX: 0,
        positionY: span / 2,
        scale: chord,
      };
    if (shape === 1)
      return {
        positionX: getXTip(angle, span),
        positionY: span / 2,
        scale: chordTip,
      };
    return {
      positionX: chord * F,
      positionY: span / 2,
      scale: 0,
    };
  }, [span, angle, chord, chordTip, shape]);

  return (
    <>
      <animated.mesh
        position-x={profileSpring.positionX}
        position-y={profileSpring.positionY}
        position-z={-0.01}
        rotation-x={Math.PI / 2}
        scale={profileSpring.scale}
      >
        <AnimatedLine points={profilePoints} opacity={opacity} />
      </animated.mesh>
      <animated.mesh
        position-x={profileSpring.positionX}
        position-y={profileSpring.positionY.to((y) => -y)}
        rotation-x={Math.PI / 2}
        scale={profileSpring.scale}
      >
        <AnimatedLine points={profilePoints} opacity={opacity} />
      </animated.mesh>
    </>
  );
};

export default ProfileOutlines;
