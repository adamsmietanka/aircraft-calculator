import { CANVAS_WIDTH, PROFILE_POSITION } from "../../common/three/config";
import { SpringValue, animated } from "@react-spring/three";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import Vector from "./Vector";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import useWingScale from "../hooks/useWingScale";
import useProfileSpring from "./hooks/useProfileSpring";
import ProfileAirstreams from "./ProfileAirstreams";

interface Props {
  opacity: SpringValue<number>;
}

const ProfileVisualizer = ({ opacity }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const y = useProfileChartsStore((state) => state.y);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const show =
    !!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"];

  const { scaleProfile } = useWingScale();

  const { profileSpring } = useProfileSpring();

  return (
    <animated.mesh position-x={(PROFILE_POSITION * CANVAS_WIDTH) / 2}>
      <animated.mesh rotation-z={profileSpring.angle} scale={scaleProfile}>
        <ProfileAirstreams opacity={opacity} show={show} />
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileVisualizer;
