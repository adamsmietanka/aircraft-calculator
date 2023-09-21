import { useMemo } from "react";
import { CANVAS_WIDTH } from "../../common/three/config";
import { useWingStore } from "../stores/useWing";
import { getXTip } from "../three/hooks/useWingSprings";

const useWingScale = (width: number) => {
  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);

  const localWidth = CANVAS_WIDTH * width;
  const localHeight = 12;

  const scale = useMemo(
    () =>
      Math.min(
        localHeight / span,
        (0.5 * localWidth) / (getXTip(angle, span) + chordTip),
        (0.5 * localWidth) / chord
      ),
    [angle, span, chord, chordTip]
  );
  const scaleProfile = 0.96 * localWidth;
  return { scale, scaleProfile };
};

export default useWingScale;
