import { Axis, Trace } from "../LineChart";
import useChartSize from "./useChartSize";

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

const useAxisTicks = (traces: Trace[], axes: Record<string, Axis>) => {
  const getTicks = (min: number, step: number, size: number) => {
    if (size < 10) step *= 2;
    const lowerAxisLimit = Math.ceil((min * 1) / step);

    const ticks = Array.from(Array(15).keys()).map(
      (i) => (i + lowerAxisLimit) * step
    );

    // fix floating point precision (TODO: maybe use decimal.js)
    return ticks.map((t) => parseFloat(t.toFixed(7)));
  };

  const { width, height } = useChartSize();

  const getMinX = () => {
    if (axes.x.min === 0) return 0;
    return axes.x.min || Math.min(...traces.map(({ points }) => points[0][0]));
  };

  const getMinY = () => {
    if (axes.y.min === 0) return 0;
    return (
      axes.y.min ||
      Math.min(
        ...traces.map(({ points }) => points.map(([x, y, z]) => y)).flat()
      )
    );
  };

  const minX = getMinX();
  const maxX = axes.x.max
    ? axes.x.max
    : Math.max(...traces.map(({ points }) => points[points.length - 1][0]));

  const minY = getMinY();
  const maxY = axes.y.max
    ? axes.y.max
    : Math.max(
        ...traces.map(({ points }) => points.map(([x, y, z]) => y)).flat()
      );

  let xStep = getStep(maxX - minX);
  let yStep = getStep(maxY - minY);
  let xTicks = getTicks(minX, xStep, width);
  let yTicks = getTicks(minY, yStep, height);

  const X_TEXTS = 3;

  const scaleX = (width - X_TEXTS) / (maxX - minX);
  const scaleY = height / (maxY - minY);

  return {
    ticks: { x: xTicks, y: yTicks },
    scale: [scaleX, scaleY, 1],
    min: { x: minX * scaleX, y: minY * scaleY },
    max: { x: maxX * scaleX, y: maxY * scaleY },
    mid: {
      x: (scaleX * (minX + maxX) - X_TEXTS) / 2,
      y: (scaleY * (minY + maxY) - 1) / 2,
    },
    step: { x: xStep, y: yStep },
  };
};

export default useAxisTicks;
