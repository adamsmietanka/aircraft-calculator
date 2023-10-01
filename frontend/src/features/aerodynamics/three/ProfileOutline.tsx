import { SpringValue, animated } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { CANVAS_WIDTH } from "../../common/three/config";
import AnimatedLine from "../../common/three/AnimatedLine";
import useProfileSpring from "./hooks/useProfileSpring";

interface Props {
  opacity: SpringValue<number>;
}

const ProfileOutline = ({ opacity }: Props) => {
  const { profilePoints, chordPoints } = useProfile();
  const { profileSpring } = useProfileSpring();

  return (
    <animated.mesh
      position-x={profileSpring.gridX.to((x) => (x * CANVAS_WIDTH) / 2)}
      scale={profileSpring.scale}
    >
      <animated.mesh
        rotation-z={profileSpring.angle}
        position-x={profileSpring.x.to((x) => x + 0.25)}
      >
        <mesh position-x={-0.25}>
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
        </mesh>
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileOutline;
