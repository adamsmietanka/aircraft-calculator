import { Props } from "../three/utils/createWingModel";

export const getArea = (config: Props) => {
  const { span, chord, chordTip, shape } = config;
  if (shape === 0) return chord * span;
  if (shape === 1) return ((chord + chordTip) * span) / 2;
  return (Math.PI * chord * span) / 4;
};

export const getTaper = (config: Props) => {
  const { chord, chordTip, shape } = config;
  if (shape === 0) return 1;
  if (shape === 1) return chordTip / chord;
  return 0;
};

export const getAspectRatio = (config: Props) => {
  const area = getArea(config);
  const { span } = config;
  return (span * span) / area;
};

export const getMAC = (config: Props) => {
  const { chord, shape } = config;
  const taperRatio = getTaper(config);

  if (shape === 0) return chord;
  if (shape === 1)
    return (
      (2 * chord * (1 + taperRatio + taperRatio * taperRatio)) /
      (3 * (1 + taperRatio))
    );
  return (8 * chord) / (3 * Math.PI);
};

export const getMACposition = (config: Props) => {
  const { span, chord, shape, angle } = config;
  const taperRatio = getTaper(config);

  if (shape === 0) return [0, -span / 4];
  if (shape === 1) {
    const tangent = Math.tan((angle * Math.PI) / 180);
    const xMAC =
      (tangent * span * (1 + 2 * taperRatio)) / (6 * (1 + taperRatio));
    const yMAC = -xMAC / tangent;
    return [xMAC, yMAC];
  }
  return [(chord / 2) * (1 - 8 / (3 * Math.PI)), -span / 4];
};
