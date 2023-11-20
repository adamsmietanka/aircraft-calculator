import { config, useSpring } from "@react-spring/three";
import useWingScale from "../../hooks/useWingScale";
import { useLocation } from "react-router-dom";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import { useWingStore } from "../../stores/useWing";
import { PROFILE_POSITION, WING_POSITION } from "../../../common/three/config";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useEffect } from "react";

const useProfileVisualizer = () => {
  const x = useProfileChartsStore((state) => state.x);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const chord = useWingStore((state) => state.chord);

  const centerVectors = useHoverProfileStore((state) => state.centerVectors);
  const fallVelocity = useHoverProfileStore((state) => state.fallVelocity);
  const keepAngle = useHoverProfileStore((state) => state.keepAngle);

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

  const [profileSpring, api] = useSpring(
    () => ({
      angle:
        keepAngle || showVisuals
          ? (-x["Coefficient of Lift"] * Math.PI) / 180
          : 0,
      scale: getScale(),
      gridX: getPosition(),
      vectorsPosition: centerVectors ? 0.25 : 0,
      positionZ: 0,
    }),
    [x, scale, chord, showVisuals, pathname, centerVectors]
  );

  useEffect(() => {
    if (fallVelocity > 0 && pathname === "/aerodynamics/levelFlight") {
      api.start({
        positionZ: -15,
        config: {
          duration: 10000 / Math.sqrt(fallVelocity),
          easing: (x) => x * x,
        },
      });
    } else {
      api.start({
        positionZ: 0,
        config: config.slow,
      });
    }
  }, [fallVelocity, pathname]);

  return { profileSpring, showVisuals };
};
export default useProfileVisualizer;
