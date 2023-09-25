import AnimatedLine from "../../common/three/AnimatedLine";
import { useWingStore } from "../stores/useWing";
import { reynolds } from "../data/profiles";
import { NUMBER_OF_AIRFOIL_POINTS } from "../../common/three/config";
import useProfile from "../hooks/useProfile";
import { SpringValue } from "@react-spring/three";

interface Props {
  opacity: SpringValue<number>;
  show: boolean;
}

const ProfileAirstreams = ({ opacity, show }: Props) => {
  const { upperPoints, lowerPoints } = useProfile();

  const profile = useWingStore((state) => state.profile);
  const reynoldsIndex = useWingStore((state) => state.reynolds);

  const speed = 0.03 * reynolds[profile][reynoldsIndex];

  const omittedPoints = Math.floor(NUMBER_OF_AIRFOIL_POINTS * 0.1);
  return (
    <mesh position-x={-0.3}>
      <mesh position-y={0.02}>
        <AnimatedLine
          points={upperPoints.slice(
            omittedPoints,
            NUMBER_OF_AIRFOIL_POINTS - omittedPoints
          )}
          scale={[1.2, 1.2, 1]}
          style="airstream"
          color="grid"
          offset={speed}
          opacity={opacity.to((o) => (show ? o * 0.33 : 0))}
        />
      </mesh>
      <mesh position-y={-0.02}>
        <AnimatedLine
          points={lowerPoints.slice(
            omittedPoints,
            NUMBER_OF_AIRFOIL_POINTS - omittedPoints
          )}
          scale={[1.2, 1.2, 1]}
          style="airstream"
          color="grid"
          offset={0.8 * speed}
          opacity={opacity.to((o) => (show ? o * 0.33 : 0))}
        />
      </mesh>
    </mesh>
  );
};

export default ProfileAirstreams;
