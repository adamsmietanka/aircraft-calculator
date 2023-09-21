import { SpringValue, animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { CANVAS_WIDTH } from "../../common/three/config";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import { useLocation } from "react-router-dom";
import AnimatedLine from "../../common/three/AnimatedLine";
import useWingScale from "../hooks/useWingScale";
import { useWingStore } from "../stores/useWing";

interface Props {
  width: number;
  gridPositionX: number;
}

const ProfileOutline = ({ width, gridPositionX }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);

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
      gridX: outlineNormal ? 0 : 0.5,
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
        <AnimatedLine points={profilePoints} />
        <AnimatedLine points={chordPoints} width={1.5} color="secondary" />
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileOutline;
