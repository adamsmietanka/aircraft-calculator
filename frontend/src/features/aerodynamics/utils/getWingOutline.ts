import { getXTip } from "../three/hooks/useWingSpring";
import { Props } from "../three/utils/createWingModel";
import getEllipticOutline from "./getEllipticOutline";

const getWingOutline = ({ span, chord, chordTip, angle, shape }: Props) => {
  const xTip = getXTip(angle, span);
  if (shape === 0)
    return {
      xOutline: [
        [0, chord],
        [0, chord],
        [0, chord],
      ],
      yOutline: [-span / 2, 0, span / 2],
    };
  if (shape === 1)
    return {
      xOutline: [
        [xTip, xTip + chordTip],
        [0, chord],
        [xTip, xTip + chordTip],
      ],
      yOutline: [-span / 2, 0, span / 2],
    };
  if (shape === 2) return getEllipticOutline(chord, span);
  return getEllipticOutline(chord, span, true);
};

export default getWingOutline;
