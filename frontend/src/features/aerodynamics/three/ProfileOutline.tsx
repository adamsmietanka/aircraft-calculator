import { SpringValue, animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { CANVAS_WIDTH } from "../../common/three/config";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import { useLocation } from "react-router-dom";
import AnimatedLine from "../../common/three/AnimatedLine";
import useWingScale from "../hooks/useWingScale";
import { useWingStore } from "../stores/useWing";

interface Props {
  opacity: SpringValue<number>;
}
const width = 0.33,
  gridPositionX = -0.55;

const ProfileOutline = ({ opacity }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const chord = useWingStore((state) => state.chord);

  const { profilePoints, chordPoints, yCamber } = useProfile();

  const location = useLocation();

  const outlineNormal =
    location.pathname === "/aerodynamics/profile" || location.pathname === "/";

  const rotateProfile =
    location.pathname === "/aerodynamics/profile" &&
    (!!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"]);

  const { scale, scaleProfile } = useWingScale(width);

  const [profileSpring] = useSpring(
    () => ({
      aoa: rotateProfile ? (-x["Coefficient of Lift"] * Math.PI) / 180 : 0,
      scale: outlineNormal ? scaleProfile : scale * chord,
      x: outlineNormal ? -0.25 : 0,
      y: outlineNormal ? -yCamber : 0,
      gridX: outlineNormal ? 0 : 1,
    }),
    [outlineNormal, yCamber, x, scale, chord, rotateProfile]
  );

  return (
    <animated.mesh
      position-x={profileSpring.gridX.to(
        (x) => x + (gridPositionX * CANVAS_WIDTH) / 2
      )}
      rotation-z={profileSpring.aoa}
      scale={profileSpring.scale}
    >
      <animated.mesh position-x={profileSpring.x} position-y={profileSpring.y}>
        <AnimatedLine points={profilePoints} opacity={opacity} />
        <AnimatedLine
          points={chordPoints}
          width={1.5}
          color="secondary"
          opacity={opacity}
        />
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileOutline;
