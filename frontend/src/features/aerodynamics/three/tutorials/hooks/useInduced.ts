const CIRCLE_POINTS = 50;
const xPos = 0.5;
const VERTEX_LOOP_NUMBER = 5;
const VERTEX_START_SIZE = 0.12;
const VERTEX_INCREASE_FACTOR = 0.06;

const useInduced = () => {
  const circle = Array.from(Array(CIRCLE_POINTS).keys()).map((i) => [
    xPos,
    -0.1 * Math.cos((i / CIRCLE_POINTS) * Math.PI),
    0.1 * Math.sin((i / CIRCLE_POINTS) * Math.PI) + 1,
  ]);
  const vort = Array.from(Array(VERTEX_LOOP_NUMBER * CIRCLE_POINTS).keys()).map(
    (i) => [
      (i / CIRCLE_POINTS) * 0.6,
      -(VERTEX_START_SIZE / 2 + (i / CIRCLE_POINTS) * VERTEX_INCREASE_FACTOR) *
        Math.cos(2 * (i / CIRCLE_POINTS) * Math.PI),
      (VERTEX_START_SIZE / 2 + (i / CIRCLE_POINTS) * VERTEX_INCREASE_FACTOR) *
        Math.sin(2 * (i / CIRCLE_POINTS) * Math.PI) +
        0,
    ]
  );
  const spanwise = [[xPos, -0.1, 0], ...circle, [xPos, 0.1, 0]];
  const vortex = [...vort];
  return { spanwise, vortex };
};

export default useInduced;
