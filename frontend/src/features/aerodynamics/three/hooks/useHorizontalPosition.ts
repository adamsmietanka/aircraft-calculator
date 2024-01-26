import { useEffect, useState } from "react";
import { getWingPointsAt } from "../../utils/getWingOutline";
import { useVerticalStore } from "../../stores/useVertical";
import { useHorizontalStore } from "../../stores/useHorizontal";
import { usePlaneStore } from "../../stores/usePlane";
import fuselages from "../../data/fuselages";

/**
 * The highest you can put a horizontal stabilizer on a vertical stabilizer
 * @param shape
 * @returns
 */
const getMaxY = (shape: number, span: number) =>
  ((shape === 2 ? 0.8 : 1) * span) / 2;

const interp = (y0: number, y1: number, x: number) => y0 + (y1 - y0) * x;

const clampOverZero = (val: number) => (val < 0 ? 0 : val);

const useHorizontalPosition = () => {
  const shape = useVerticalStore((state) => state.shape);
  const span = useVerticalStore((state) => state.span);
  const chord = useVerticalStore((state) => state.chord);
  const chordTip = useVerticalStore((state) => state.chordTip);
  const angle = useVerticalStore((state) => state.angle);

  const position = useHorizontalStore((state) => state.position);

  const fuselage = usePlaneStore((state) => state.fuselage);
  const length = usePlaneStore((state) => state.length);

  const set = useHorizontalStore((state) => state.set);

  const [positionLeadTrail, setPositionLeadTrail] = useState([0, 0]);
  const [y, setY] = useState(0);

  useEffect(() => {
    const { horizontalY, verticalY } = fuselages[fuselage];
    const horizontalGap = (verticalY - horizontalY) * length;
    const relativeY = interp(-horizontalGap, getMaxY(shape, span), position);
    const y = verticalY * length + relativeY;
    const leadTrail = getWingPointsAt(
      {
        shape,
        span,
        chord,
        chordTip,
        angle,
      },
      clampOverZero(relativeY)
    );
    setY(y);
    setPositionLeadTrail(leadTrail);
    const newChord = leadTrail[1] - leadTrail[0];
    set({ chord: newChord, chordTip: 0.6 * newChord });
  }, [shape, span, chord, position, fuselage]);

  return { positionLeadTrail, y };
};

export default useHorizontalPosition;
