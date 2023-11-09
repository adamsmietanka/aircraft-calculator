import { CANVAS_WIDTH } from "../../common/three/config";
import { SpringValue, animated } from "@react-spring/three";
import useProfileVisualizer from "./hooks/useProfileVisualizer";
import ProfileAirstreams from "./ProfileAirstreams";
import useProfile from "../hooks/useProfile";
import AnimatedLine from "../../common/three/AnimatedLine";
import ProfileVectors from "./ProfileVectors";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import ProfileFlowSpeed from "./ProfileFlowSpeed";
import { useWingStore } from "../stores/useWing";

interface Props {
  opacity: SpringValue<number>;
}

const ProfileVisualizer = ({ opacity }: Props) => {
  const profile = useWingStore((state) => state.profile);

  const { profilePoints, chordPoints } = useProfile();
  const { profileSpring, showVisuals } = useProfileVisualizer();

  const showChord = useHoverProfileStore((state) => state.showChord);
  const showCamber = useHoverProfileStore((state) => state.showCamber);
  const showVectors = useHoverProfileStore((state) => state.showVectors);

  return (
    <animated.mesh
      position-x={profileSpring.gridX.to((x) => (x * CANVAS_WIDTH) / 2)}
      position-y={profileSpring.positionZ}
      scale={profileSpring.scale}
    >
      <animated.mesh rotation-z={profileSpring.angle} position-x={0.25}>
        <mesh position-x={-0.25}>
          <AnimatedLine points={profilePoints} width={2} opacity={opacity} />
          <AnimatedLine
            points={chordPoints}
            width={1.5}
            color="secondary"
            opacity={opacity.to((o) =>
              showCamber && profile.length === 4 ? o / 1.5 : 0
            )}
          />
          <AnimatedLine
            points={[
              [0, 0, -0.01],
              [1, 0, -0.01],
            ]}
            style="thin"
            color="grid"
            opacity={opacity.to((o) => (showChord ? o / 5 : 0))}
          />
          <ProfileAirstreams opacity={opacity} show={showVisuals} />
        </mesh>

        <animated.mesh
          position-x={profileSpring.vectorsPosition}
          rotation-z={profileSpring.angle.to((a) => -a)}
          scale={profileSpring.scale.to((scale) => 1 / scale)}
        >
          <ProfileVectors opacity={opacity} show={showVectors && showVisuals} />
        </animated.mesh>
      </animated.mesh>
      <animated.mesh scale={profileSpring.scale.to((s) => 1 / s)}>
        <ProfileFlowSpeed opacity={opacity} show={showVisuals} />
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileVisualizer;
