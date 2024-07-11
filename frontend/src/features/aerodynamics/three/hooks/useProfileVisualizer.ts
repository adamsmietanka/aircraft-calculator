import { config, useSpring } from "@react-spring/three";
import useWingScale from "../../hooks/useWingScale";
import { useLocation } from "react-router-dom";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import { useWingStore } from "../../stores/useWing";
import { PROFILE_POSITION, WING_POSITION } from "../../../common/three/config";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useEffect } from "react";
import useConfig from "../../../common/subtitles/hooks/useConfig";

const useProfileVisualizer = () => {
  const x = useProfileChartsStore((state) => state.x);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const chord = useWingStore((state) => state.chord);
  const dragging = useWingStore((state) => state.dragging);

  const centerVectors = useHoverProfileStore((state) => state.centerVectors);
  const vector3rdNewton = useHoverProfileStore(
    (state) => state.vector3rdNewton
  );
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

  const [profileSpring, api] = useSpring(() => ({
    angle: 0,
    scale: getScale(),
    gridX: getPosition(),
    vectorsPosition: centerVectors ? 0.25 : 0,
    vectorY: 0,
    positionZ: 0,
  }));

  const { customConfig } = useConfig();

  useEffect(() => {
    if (fallVelocity > 0 && pathname === "/aerodynamics/levelFlight") {
      api.start({
        positionZ: -15,
        config: {
          duration: 15000 / Math.sqrt(fallVelocity),
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

  useEffect(() => {
    api.start({
      angle:
        keepAngle || showVisuals
          ? (-x["Coefficient of Lift"] * Math.PI) / 180
          : 0,
      gridX: getPosition(),
      vectorsPosition: centerVectors ? 0.25 : 0,
      vectorY: vector3rdNewton ? -0.03 : 0,
      config: customConfig,
    });
    if (!dragging) {
      api.start({
        scale: getScale(),
      });
    }
  }, [
    x,
    chord,
    showVisuals,
    pathname,
    centerVectors,
    vector3rdNewton,
    customConfig,
    dragging,
    scale
  ]);

  return { profileSpring, showVisuals };
};
export default useProfileVisualizer;
