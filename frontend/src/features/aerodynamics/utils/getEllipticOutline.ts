const SEGMENTS = 20;

const getEllipticOutline = (chord: number, span: number, reverse = false) => {
  const F = reverse ? 0.7 : 0.3;

  /**
   * Array of angles from -180 to 180 with sine spacing (denser at the ends)
   */
  const angles = [...new Array(SEGMENTS + 1)].map(
    (i, index) =>
      (Math.sin((((2 * index - SEGMENTS) / SEGMENTS) * Math.PI) / 2) *
        Math.PI) /
      2
  );

  let leadingPoints = angles.map((i) => [
    chord * F * (1 - Math.cos(i)),
    (span / 2) * Math.sin(i),
    0,
  ]);

  let trailingPoints = angles.map((i) => [
    chord * (F + (1 - F) * Math.cos(i)),
    (span / 2) * Math.sin(i),
    0,
  ]);

  return {
    xOutline: leadingPoints.map(([x], index) => [x, trailingPoints[index][0]]),
    yOutline: leadingPoints.map(([x, y, z]) => y),
  };
};

export default getEllipticOutline;
