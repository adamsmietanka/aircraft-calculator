import { Axis, Trace } from "../LineChart";
import useChartSize from "./useChartSize";

const useAxisTicks = (traces: Trace[], xAxis: Axis, yAxis: Axis) => {
  const getNormalizedStep = (remainder: number) => {
    // examples for log(range) ~ 2
    if (remainder > 0.95) return 2; // For range > 891
    else if (remainder > 0.65) return 1; // for range > 446
    else if (remainder > 0.25) return 0.5; // for range > 177
    return 0.2; // for range > 89.1
  };

  const getTicks = (min: number, max: number) => {
    const range = max - min;
    const log = Math.log10(range);
    const rem = log % 1;
    const remainder = rem >= 0 ? rem : 1 + rem;

    let step = getNormalizedStep(remainder);

    step *= Math.pow(10, Math.floor(log));

    const lowerAxisLimit = Math.ceil((min * 1) / step);

    const ticks = Array.from(Array(15).keys()).map(
      (i) => (i + lowerAxisLimit) * step
    );
    
    // fix floating point precision (TODO: maybe use decimal.js)
    return ticks.map((t) => parseFloat(t.toFixed(7)));;
  };

  const { width, height } = useChartSize();

  const getMinX = () => {
    if (xAxis.min === 0) return 0;
    return xAxis.min || Math.min(...traces.map(({ points }) => points[0][0]));
  };

  const getMinY = () => {
    if (yAxis.min === 0) return 0;
    return (
      yAxis.min ||
      Math.min(
        ...traces.map(({ points }) => points.map(([x, y, z]) => y)).flat()
      )
    );
  };

  const minX = getMinX();
  const maxX = xAxis.max
    ? xAxis.max
    : Math.max(...traces.map(({ points }) => points[points.length - 1][0]));

  const minY = getMinY();
  const maxY = yAxis.max
    ? yAxis.max
    : Math.max(
        ...traces.map(({ points }) => points.map(([x, y, z]) => y)).flat()
      );

  let xTicks = getTicks(minX, maxX);
  let yTicks = getTicks(minY, maxY);

  if (width < 10) {
    xTicks = xTicks.map((x) => x * 2);
  }
  if (height < 10) {
    yTicks = yTicks.map((y) => y * 2);
  }

  const scaleX = width / (maxX - minX);
  const scaleY = height / (maxY - minY);

  return {
    xTicks,
    yTicks,
    scaleX,
    scaleY,
    minX: minX * scaleX,
    minY: minY * scaleY,
    midX: (scaleX * (minX + maxX) - 3) / 2,
    midY: (scaleY * (minY + maxY) -1) / 2,
  };
};

export default useAxisTicks;
