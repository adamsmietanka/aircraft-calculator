import { useSpring } from "@react-spring/three";
import useWingScale from "../../hooks/useWingScale";
import { useLocation } from "react-router-dom";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import { useWingStore } from "../../stores/useWing";
import { PROFILE_POSITION, WING_POSITION } from "../../../common/three/config";

const useProfileVisualizer = () => {
  const x = useProfileChartsStore((state) => state.x);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const chord = useWingStore((state) => state.chord);

  const { scale, scaleProfile } = useWingScale();

  const { pathname } = useLocation();

  const showVisuals =
    (pathname === "/aerodynamics/profile" && !!locked) || hover;

  const getScale = () => {
    switch (pathname) {
      case "/":
      case "/aerodynamics/introduction":
      case "/aerodynamics/profile":
      case "/aerodynamics/levelFlight":
      case "/aerodynamics/inducedDrag":
        return scaleProfile;
      default:
        return scale * chord;
    }
  };

  // Returns [gridPosition, localPosition]
  const getPosition = () => {
    switch (pathname) {
      case "/":
      case "/aerodynamics/introduction":
      case "/aerodynamics/profile":
      case "/aerodynamics/levelFlight":
      case "/aerodynamics/inducedDrag":
        return PROFILE_POSITION;
      default:
        return WING_POSITION;
    }
  };

  const [profileSpring] = useSpring(
    () => ({
      angle: showVisuals ? (-x["Coefficient of Lift"] * Math.PI) / 180 : 0,
      scale: getScale(),
      gridX: getPosition(),
    }),
    [x, scale, chord, showVisuals, pathname]
  );

  return { profileSpring, showVisuals };
};
export default useProfileVisualizer;
