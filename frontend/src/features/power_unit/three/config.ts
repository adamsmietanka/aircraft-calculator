import { getHSLColorFromCSS } from "../../../utils/getCSScolor";
import { useThemeStore } from "../../settings/stores/useTheme";
import { useMemo } from "react";

export const POINTS_BEFORE_MAX_RPM = 50;
export const GRID_WIDTH = 0.2;
export const NUMBERS_PADDING = 0.5;
export const TITLE_PADDING = 1.5;
export const POINT_SIZE = 0.5;

export const useCSSColors = () => {
  const theme = useThemeStore((state) => state.theme);

  const traceColor = useMemo(() => getHSLColorFromCSS("a"), [theme]);
  const surfaceColor = useMemo(() => getHSLColorFromCSS("p"), [theme]);
  const gridColor = useMemo(() => getHSLColorFromCSS("bc"), [theme]);
  const infoColor = useMemo(() => getHSLColorFromCSS("in"), [theme]);
  const errorColor = useMemo(() => getHSLColorFromCSS("er"), [theme]);

  return { traceColor, surfaceColor, gridColor, infoColor, errorColor };
};
