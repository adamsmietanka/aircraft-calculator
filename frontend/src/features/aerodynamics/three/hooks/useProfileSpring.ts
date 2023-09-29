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

  const rotateProfile =
    location.pathname === "/aerodynamics/profile" &&
    (!!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"]);

  const getScale = () => {
    switch (location.pathname) {
      case "/":
      case "/aerodynamics/introduction":
      case "/aerodynamics/profile":
        return scaleProfile;
      default:
        return scale * chord;
    }
  };

  // Returns [gridPosition, localPosition]
  const getPosition = () => {
    switch (location.pathname) {
      case "/":
      case "/aerodynamics/introduction":
        return [0, -0.5];
      case "/aerodynamics/profile":
        return [PROFILE_POSITION, -0.25];
      default:
        return [WING_POSITION, 0];
    }
  };

  const [profileSpring] = useSpring(
    () => ({
      angle: rotateProfile ? (-x["Coefficient of Lift"] * Math.PI) / 180 : 0,
      scale: getScale(),
      gridX: getPosition()[0],
      x: getPosition()[1],
    }),
    [x, scale, chord, rotateProfile, location.pathname]
  );
  
  return { profileSpring };
};
export default useProfileSpring;
