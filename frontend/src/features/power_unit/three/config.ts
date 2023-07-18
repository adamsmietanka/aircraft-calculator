import { getHSLColorFromCSS } from "../../../utils/getCSScolor";
import { useThemeStore } from "../../settings/stores/useTheme";
import { useMemo } from "react";

export const GRID_WIDTH = 1.0;
export const NUMBERS_PADDING = 0.5;
export const TITLE_PADDING = 1.5;
export const POINT_SIZE = 0.5;

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
  const infoColor = useMemo(() => getHSLColorFromCSS("in"), [theme]);
  const errorColor = useMemo(() => getHSLColorFromCSS("er"), [theme]);

  return {
    traceColor,
    primaryColor,
    secondaryColor,
    accentColor,
    surfaceColor,
    gridColor,
    infoColor,
    errorColor,
  };
};
