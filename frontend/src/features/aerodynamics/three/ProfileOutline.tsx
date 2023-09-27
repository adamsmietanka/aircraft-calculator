import { SpringValue, animated } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { CANVAS_WIDTH, PROFILE_POSITION } from "../../common/three/config";
import AnimatedLine from "../../common/three/AnimatedLine";
import useProfileSpring from "./hooks/useProfileSpring";

interface Props {
  opacity: SpringValue<number>;
}
const width = 0.4,
  gridPositionX = PROFILE_POSITION;

const ProfileOutline = ({ opacity }: Props) => {
  const { profilePoints, chordPoints } = useProfile();
  const { profileSpring } = useProfileSpring(width);

  return (
    <animated.mesh
      position-x={profileSpring.gridX.to(
        (x) => x + (gridPositionX * CANVAS_WIDTH) / 2
      )}
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
