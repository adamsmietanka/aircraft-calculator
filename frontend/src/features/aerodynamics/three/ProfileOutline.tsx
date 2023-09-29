import { SpringValue, animated } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { CANVAS_WIDTH } from "../../common/three/config";
import AnimatedLine from "../../common/three/AnimatedLine";
import useProfileSpring from "./hooks/useProfileSpring";
import { useLocation } from "react-router-dom";
import { useIntroductionStore } from "../stores/useIntroduction";
import { useWingStore } from "../stores/useWing";

interface Props {
  opacity: SpringValue<number>;
}

const ProfileOutline = ({ opacity }: Props) => {
  const location = useLocation();

  const onProfile = location.pathname === "/aerodynamics/profile";

  const profile = onProfile
    ? undefined
    : useIntroductionStore((state) => state.profile);

  const { profilePoints, chordPoints } = useProfile(profile);
  const { profileSpring } = useProfileSpring();

  return (
    <animated.mesh
      position-x={profileSpring.gridX.to((x) => (x * CANVAS_WIDTH) / 2)}
      rotation-z={profileSpring.angle}
      scale={profileSpring.scale}
    >
      <animated.mesh position-x={profileSpring.x}>
        <AnimatedLine points={profilePoints} width={2} opacity={opacity} />
        <AnimatedLine
          points={chordPoints}
          width={1.5}
          color="secondary"
          opacity={opacity.to((o) => o / 1.5)}
        />
        <AnimatedLine
          points={[
            [0, 0, -0.01],
            [1, 0, -0.01],
          ]}
          scale={[1, 1, 1]}
          style="thin"
          color="grid"
          opacity={opacity.to((o) => o / 5)}
        />
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileOutline;
