import AnimatedLine from "../../common/three/AnimatedLine";
import { useWingStore } from "../stores/useWing";
import { getReynolds } from "../data/profiles";
import { NUMBER_OF_AIRFOIL_POINTS } from "../../common/three/config";
import useProfile from "../hooks/useProfile";
import { SpringValue } from "@react-spring/three";
import { useProfileChartsStore } from "../hooks/useProfileCharts";

interface Props {
  opacity: SpringValue<number>;
  show: boolean;
}

const ProfileAirstreams = ({ opacity, show }: Props) => {
  const { upperPoints, lowerPoints } = useProfile();

  const profile = useWingStore((state) => state.profile);
  const reynoldsIndex = useWingStore((state) => state.reynolds);

  const speed = 0.03 * getReynolds(profile)[reynoldsIndex];

  const omittedPoints = Math.floor(NUMBER_OF_AIRFOIL_POINTS * 0.1);

  const y = useProfileChartsStore((state) => state.y);
  return (
    <mesh>
      <mesh position-y={0.02}>
        <AnimatedLine
          points={upperPoints.slice(
            omittedPoints,
            NUMBER_OF_AIRFOIL_POINTS - omittedPoints + 1
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
            NUMBER_OF_AIRFOIL_POINTS - omittedPoints + 1
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
