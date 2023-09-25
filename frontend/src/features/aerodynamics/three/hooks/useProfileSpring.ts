import { useSpring } from "@react-spring/three";
import useWingScale from "../../hooks/useWingScale";
import { useLocation } from "react-router-dom";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import { useWingStore } from "../../stores/useWing";
import {
  CANVAS_WIDTH,
  PROFILE_POSITION,
  WING_POSITION,
} from "../../../common/three/config";

const useProfileSpring = (width: number) => {
  const x = useProfileChartsStore((state) => state.x);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const chord = useWingStore((state) => state.chord);

  const { scale, scaleProfile } = useWingScale(width);

  const location = useLocation();

  const outlineNormal = location.pathname === "/aerodynamics/profile";

  const rotateProfile =
    outlineNormal &&
    (!!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"]);

  const [profileSpring] = useSpring(
    () => ({
      angle: rotateProfile ? (-x["Coefficient of Lift"] * Math.PI) / 180 : 0,
      scale: outlineNormal ? scaleProfile : scale * chord,
      x: outlineNormal ? -0.25 : 0,
      gridX: outlineNormal
        ? 0
        : ((WING_POSITION - PROFILE_POSITION) * CANVAS_WIDTH) / 2,
    }),
    [x, scale, chord, outlineNormal, rotateProfile]
  );
  return { profileSpring };
};
export default useProfileSpring;
