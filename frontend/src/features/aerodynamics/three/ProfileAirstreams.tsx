import AnimatedLine from "../../common/three/AnimatedLine";
import { useWingStore } from "../stores/useWing";
import { NUMBER_OF_AIRFOIL_SEGMENTS } from "../../common/three/config";
import { SpringValue } from "@react-spring/three";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import { useProfileStore } from "../stores/useProfile";

interface Props {
  opacity: SpringValue<number>;
  show: boolean;
}

const ProfileAirstreams = ({ opacity, show }: Props) => {
  const upperPoints = useProfileStore((state) => state.upper);
  const lowerPoints = useProfileStore((state) => state.lower);

  const reynolds = useWingStore((state) => state.reynolds);

  const speed = 0.03 * reynolds;

  const omittedPoints = Math.floor(NUMBER_OF_AIRFOIL_SEGMENTS * 0.1);

  const y = useProfileChartsStore((state) => state.y);
  return (
    <mesh>
      <mesh position-y={0.02}>
        <AnimatedLine
          points={upperPoints.slice(
            omittedPoints,
            NUMBER_OF_AIRFOIL_SEGMENTS - omittedPoints + 1
          )}
          style="airstream"
          color="grid"
          offset={speed + y["Coefficient of Lift"] * 0.025}
          opacity={opacity.to((o) => (show ? o * 0.33 : 0))}
        />
      </mesh>
      <mesh position-y={-0.02}>
        <AnimatedLine
          points={lowerPoints.slice(
            omittedPoints,
            NUMBER_OF_AIRFOIL_SEGMENTS - omittedPoints + 1
          )}
          style="airstream"
          color="grid"
          offset={speed - y["Coefficient of Lift"] * 0.025}
          opacity={opacity.to((o) => (show ? o * 0.33 : 0))}
        />
      </mesh>
    </mesh>
  );
};

export default ProfileAirstreams;
