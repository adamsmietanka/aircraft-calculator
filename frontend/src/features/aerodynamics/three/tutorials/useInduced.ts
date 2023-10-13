const CIRCLE_POINTS = 50;
const xPos = 0.5;
const VERTEX_LOOP_NUMBER = 5;

const useInduced = () => {
  const circle = Array.from(Array(CIRCLE_POINTS).keys()).map((i) => [
    xPos,
    -0.1 * Math.cos((i / CIRCLE_POINTS) * Math.PI),
    0.1 * Math.sin((i / CIRCLE_POINTS) * Math.PI) + 1,
  ]);
  const vort = Array.from(Array(VERTEX_LOOP_NUMBER * CIRCLE_POINTS).keys()).map(
    (i) => [
      (i / CIRCLE_POINTS) * 0.5,
      -(0.1 + (i / CIRCLE_POINTS) * 0.03) *
        Math.cos(2 * (i / CIRCLE_POINTS) * Math.PI),
      (0.1 + (i / CIRCLE_POINTS) * 0.03) *
        Math.sin(2 * (i / CIRCLE_POINTS) * Math.PI) +
        0,
    ]
  );
  const spanwise = [[xPos, -0.1, 0], ...circle, [xPos, 0.1, 0]];
  const vortex = [[-0.05, -0.1, -0.05], ...vort];
  return { spanwise, vortex };
};

export default useInduced;
