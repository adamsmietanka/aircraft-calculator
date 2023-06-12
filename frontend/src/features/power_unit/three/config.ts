import * as THREE from "three";
import { getHSLColorFromCSS } from "../../../utils/getCSScolor";
import { useThemeStore } from "../../settings/stores/useTheme";
import { useMemo } from "react";

export const POINTS_BEFORE_MAX_RPM = 50;

export const useCSSColors = () => {
  const theme = useThemeStore((state) => state.theme);

  const traceColor = useMemo(() => getHSLColorFromCSS("in"), [theme]);
  const surfaceColor = useMemo(() => getHSLColorFromCSS("p"), [theme]);
  const infoColor = useMemo(() => getHSLColorFromCSS("in"), [theme]);
  const errorColor = useMemo(() => getHSLColorFromCSS("er"), [theme]);

  return { traceColor, surfaceColor, infoColor, errorColor };
};
