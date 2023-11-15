import { getHSLColorFromCSS } from "../../../utils/getCSScolor";
import { useThemeStore } from "../../settings/stores/useTheme";
import { useMemo } from "react";

//Profile
export const NUMBER_OF_AIRFOIL_POINTS = 25;
export const PROFILE_POSITION = -0.8;
export const PROFILE_WIDTH = 0.4;
export const WING_POSITION = -0.45;

export const DRAG_VECTOR_SCALE = 10;

export const GRID_WIDTH = 1.0;
export const GRID_OPACITY = 0.1;
export const NUMBERS_PADDING = 0.5;
export const TITLE_PADDING = 1.5;
export const POINT_SIZE = 0.5;

export const FONT_SIZE = 0.6;

// measured in Three.js world units
export const CANVAS_WIDTH = 20;
export const CANVAS_HEIGHT = 15;

export const MEASUREMENT_DISTANCE = 0.5;
export const MEASUREMENT_SIDE = MEASUREMENT_DISTANCE * 1.2;

export const VECTOR_TIP_LENGTH = 0.15;
export const VECTOR_TIP_WIDTH = VECTOR_TIP_LENGTH / 2.5;

//VectorNew
export const VECTOR_SIZE = 3.5;

//Camera and route animation
export const ROUTE_DELAY = 600;
export const CAMERA_DELAY = 100;

// Chart Animations
export const POSITION_ANIMATION_DURATION = 0.5;
export const POSITION_STAGGER = 0.0; // duration between the start of animation of the 1st and last point in a trace
export const OPACITY_STAGGER = 0.5;
export const OPACITY_DELAY = 0.4; // duration between render and 1st point appearing

// Power Unit Results
export const POINTS_BEFORE_MAX_RPM = 50;

export const useCSSColors = () => {
  const theme = useThemeStore((state) => state.theme);

  const traceColor = useMemo(() => getHSLColorFromCSS("p"), [theme]);
  const primaryColor = useMemo(() => getHSLColorFromCSS("p"), [theme]);
  const secondaryColor = useMemo(() => getHSLColorFromCSS("s"), [theme]);
  const accentColor = useMemo(() => getHSLColorFromCSS("a"), [theme]);
  const surfaceColor = useMemo(() => getHSLColorFromCSS("a"), [theme]);
  const gridColor = useMemo(() => getHSLColorFromCSS("bc"), [theme]);
  const backgroundColor = useMemo(() => getHSLColorFromCSS("b1"), [theme]);
  const infoColor = useMemo(() => getHSLColorFromCSS("in"), [theme]);
  const errorColor = useMemo(() => getHSLColorFromCSS("er"), [theme]);
  const colors = useMemo<Record<string, string>>(
    () => ({
      primary: primaryColor,
      secondary: secondaryColor,
      error: errorColor,
      info: infoColor,
      grid: gridColor,
    }),
    [theme]
  );

  return {
    traceColor,
    primaryColor,
    secondaryColor,
    accentColor,
    surfaceColor,
    gridColor,
    backgroundColor,
    infoColor,
    errorColor,
    colors,
  };
};
