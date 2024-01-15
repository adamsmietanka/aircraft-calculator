import { getXTip } from "../three/hooks/useWingSpring";
import { Props } from "../three/utils/createWingModel";

const SEGMENTS = 20;

const getLeadingTrailing = (
  { span, chord, chordTip, angle, shape }: Props,
  reverse = false,
  full = true
) => {
  const F = reverse ? 0.7 : 0.3;
  const xTip = getXTip(angle, span);

  /**
   * Array of points from -1 to 1 with sine spacing (denser at the ends)
   */
  const points = [...new Array(SEGMENTS + 1)]
    .map((i, index) =>
      Math.sin((((2 * index - SEGMENTS) / SEGMENTS) * Math.PI) / 2)
    )
    .filter((i) => full || i >= 0);

  const angles = points.map((i) => (i * Math.PI) / 2);

  if (shape === 2)
    return {
      leadingPoints: angles.map((i) => [
        chord * F * (1 - Math.cos(i)),
        (span / 2) * Math.sin(i),
        0,
      ]),
      trailingPoints: angles.map((i) => [
        chord * (F + (1 - F) * Math.cos(i)),
        (span / 2) * Math.sin(i),
        0,
      ]),
    };

  const leadingPoints = points.map((i) => {
    if (shape === 0) return [0, (i * span) / 2, 0];
    return [Math.abs(i) * xTip, (i * span) / 2, 0];
  });

  const trailingPoints = points.map((i) => {
    if (shape === 0) return [chord, (i * span) / 2, 0];
    return [
      Math.abs(i) * (xTip + chordTip) + (1 - Math.abs(i)) * chord,
      (i * span) / 2,
      0,
    ];
  });

  return {
    leadingPoints,
    trailingPoints,
  };
};

export default getLeadingTrailing;
