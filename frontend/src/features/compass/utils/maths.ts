export const getDistances = (
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number }
) => ({
  AB: Math.hypot(B.y - A.y, B.x - A.x),
  AC: Math.hypot(C.y - A.y, C.x - A.x),
});

export const getAngles = (
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number }
) => ({
  alphaAB: Math.atan2(B.y - A.y, B.x - A.x),
  alphaAC: Math.atan2(C.y - A.y, C.x - A.x),
});
