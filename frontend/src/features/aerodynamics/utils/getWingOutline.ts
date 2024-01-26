import { getXTip } from "../three/hooks/useWingSpring";
import { Props } from "../three/utils/createWingModel";
import getLeadingTrailing from "./getLeadingTrailing";

export const getWingPointsAt = (config: Props, y: number): number[] => {
  const { span, chord, chordTip, angle, shape } = config;
  const xTip = getXTip(angle, span);

  const j = Math.abs((2 * y) / span);

  if (shape === 0) return [0, chord];
  if (shape === 1) return [j * xTip, j * (xTip + chordTip) + (1 - j) * chord];
  return [
    0.7 * chord * (1 - Math.sqrt(1 - j * j)),
    chord * (0.7 + 0.3 * Math.sqrt(1 - j * j)),
  ];
};

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
