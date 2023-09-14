import { useMemo } from "react";
import { getXTip } from "../three/hooks/useWingSprings";
import { useWingStore } from "../stores/useWing";
import { useHoverWingStore } from "../three/WingHoverables";
import { Shape } from "three";
import useWingElliptical from "./useWingElliptical";

const useHoverables = () => {
  const wing = useWingStore();
  const hoverStore = useHoverWingStore();

  const { surfacePoints } = useWingElliptical();

  const shape = useMemo(() => {
    const xTip = getXTip(wing.angle, wing.span);
    const shape = new Shape();

    if (wing.shape === 0) {
      shape.moveTo(0, wing.span / 2);
      shape.lineTo(wing.chord, wing.span / 2);
      shape.lineTo(wing.chord, -wing.span / 2);
      shape.lineTo(0, -wing.span / 2);
    } else if (wing.shape === 1) {
      shape.lineTo(xTip, wing.span / 2);
      shape.lineTo(xTip + wing.chordTip, wing.span / 2);
      shape.lineTo(wing.chord, 0);
      shape.lineTo(xTip + wing.chordTip, -wing.span / 2);
      shape.lineTo(xTip, -wing.span / 2);
    } else {
      surfacePoints.forEach((p) => {
        shape.lineTo(p[0], p[1]);
      });
    }
    return shape;
  }, [hoverStore.surface, wing.shape]);
  return { shape };
};
export default useHoverables;
