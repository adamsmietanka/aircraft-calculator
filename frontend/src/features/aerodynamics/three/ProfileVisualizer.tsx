import { CANVAS_WIDTH } from "../../common/three/config";
import { SpringValue, animated } from "@react-spring/three";
import useProfileVisualizer from "./hooks/useProfileVisualizer";
import ProfileAirstreams from "./ProfileAirstreams";
import useProfile from "../hooks/useProfile";
import AnimatedLine from "../../common/three/AnimatedLine";
import ProfileVectors from "./ProfileVectors";

interface Props {
  opacity: SpringValue<number>;
}

const ProfileVisualizer = ({ opacity }: Props) => {
  const { profilePoints, chordPoints } = useProfile();
  const { profileSpring, showVisuals } = useProfileVisualizer();

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
          <ProfileAirstreams opacity={opacity} show={showVisuals} />
        </mesh>
      </animated.mesh>
      <animated.mesh
        position-x={profileSpring.x.to((x) => x + 0.25)}
        scale={profileSpring.scale.to((scale) => 1 / scale)}
      >
        <ProfileVectors opacity={opacity} show={showVisuals} />
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileVisualizer;
