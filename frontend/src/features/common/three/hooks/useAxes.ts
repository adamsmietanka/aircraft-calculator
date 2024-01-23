import { Axis, Trace } from "../LineChart";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";

const getNormalizedStep = (remainder: number) => {
  // examples for log(range) ~ 2
  if (remainder > 0.95) return 2; // For range > 891
  else if (remainder > 0.65) return 1; // for range > 446
  else if (remainder > 0.25) return 0.5; // for range > 177
  return 0.2; // for range > 89.1
};

export const getStep = (range: number) => {
  const log = Math.log10(range);
  const rem = log % 1;
  const remainder = rem >= 0 ? rem : 1 + rem;

  return getNormalizedStep(remainder) * Math.pow(10, Math.floor(log));
};

const useAxisTicks = (
  traces: Trace[],
  axes: Record<string, Axis>,
  width: number = 1,
  height = 0.85
) => {
  const dataMinX = Math.min(...traces.map(({ points }) => points[0][0]));

  const dataMaxX = Math.max(
    ...traces.map(({ points }) => points[points.length - 1][0])
  );

  const dataMinY = Math.min(
    ...traces.map(({ points }) => points.map(([x, y, z]) => y)).flat()
  );

  const dataMaxY = Math.max(
    ...traces.map(({ points }) => points.map(([x, y, z]) => y)).flat()
  );

  const minX = axes.x.min !== undefined ? axes.x.min : dataMinX;
  const maxX = axes.x.max ? axes.x.max : dataMaxX;

  const minY = axes.y.min !== undefined ? axes.y.min : dataMinY;
  const maxY = axes.y.max ? axes.y.max : dataMaxY;

  let xStep = getStep(maxX - minX);
  let yStep = getStep(maxY - minY);

  const getTicks = (min: number, step: number, localWidth: number) => {
    if (localWidth < 10) step *= 2;
    const lowerAxisLimit = Math.ceil((min * 1) / step);

    const ticks = Array.from(Array(15).keys()).map(
      (i) => (i + lowerAxisLimit) * step
    );

    // fix floating point precision (TODO: maybe use decimal.js)
    return ticks.map((t) => parseFloat(t.toFixed(7)));
  };

  const localWidth = width * CANVAS_WIDTH;
  const localHeight = height * CANVAS_HEIGHT;

  let xTicks = getTicks(minX, xStep, localWidth);
  let yTicks = getTicks(minY, yStep, localHeight);

  const X_TEXTS = 3;
  const Y_TEXTS = 0.5;

  const scaleX = (localWidth - X_TEXTS) / (maxX - minX);
  const scaleY = (localHeight - Y_TEXTS) / (maxY - minY);

  return {
    ticks: { x: xTicks, y: yTicks },
    scale: [scaleX, scaleY, 1],
    min: { x: minX * scaleX, y: minY * scaleY },
    max: { x: maxX * scaleX, y: maxY * scaleY },
    data: {
      min: { x: dataMinX, y: dataMinY },
      max: { x: dataMaxX, y: dataMaxY },
    },
    mid: {
      x: (scaleX * (minX + maxX) - X_TEXTS) / 2,
      y: (scaleY * (minY + maxY) - Y_TEXTS) / 2,
    },
    step: { x: xStep, y: yStep },
  };
};

export default useAxisTicks;
