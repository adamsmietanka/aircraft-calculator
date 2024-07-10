import { useSpring } from "@react-spring/three";
import { useWingStore } from "../../stores/useWing";
import useWingScale from "../../hooks/useWingScale";
import useProfileCamber from "../../hooks/useProfileCamber";
import { useEffect } from "react";

export const getXTip = (angle: number, span: number) =>
  (Math.tan((angle * Math.PI) / 180) * span) / 2;

const useWingSpring = (width: number) => {
  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);
  const dragging = useWingStore((state) => state.dragging);

  const shape = useWingStore((state) => state.shape);
  const { F } = useProfileCamber();

  const { scale } = useWingScale();

  const [wingSpring, api] = useSpring(
    () => ({
      scale,
      x: shape === 0 ? 0 : shape === 1 ? getXTip(angle, span) : F * chord,
      y: span / 2,
      rotationZ: shape === 1 ? (-angle * Math.PI) / 180 : 0,
      chord,
      chordTip,
      angle: (angle * Math.PI) / 180,
    }),
    []
  );

  useEffect(() => {
    if (!dragging) {
      api.start({
        scale,
      });
    }
  }, [dragging]);

  useEffect(() => {
    api.start({
      x: shape === 0 ? 0 : shape === 1 ? getXTip(angle, span) : F * chord,
      y: span / 2,
      rotationZ: shape === 1 ? (-angle * Math.PI) / 180 : 0,
      chord,
      chordTip,
      angle: (angle * Math.PI) / 180,
    });
  }, [span, angle, chord, chordTip, shape]);

  return { wingSpring };
};
export default useWingSpring;
