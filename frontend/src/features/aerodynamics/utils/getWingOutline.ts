import { getXTip } from "../three/hooks/useWingSpring";
import { Props } from "../three/utils/createWingModel";
import getLeadingTrailing from "./getLeadingTrailing";

const getWingOutline = (config: Props, reverse = false) => {
  const { span, chord, chordTip, angle, shape } = config;
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
  const { leadingPoints, trailingPoints } = getLeadingTrailing(config, reverse);
  return {
    xOutline: leadingPoints.map(([x], index) => [x, trailingPoints[index][0]]),
    yOutline: leadingPoints.map(([x, y, z]) => y),
  };
};

export default getWingOutline;
