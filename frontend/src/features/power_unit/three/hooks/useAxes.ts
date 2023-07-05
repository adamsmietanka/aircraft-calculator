import { Axis, Point } from "../Chart2D";

const useAxisTicks = (points: Point[], xAxis: Axis, yAxis: Axis) => {
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

    return Array.from(Array(10).keys()).map((i) => (i + lowerAxisLimit) * step);
  };

  const getMinX = () => {
    if (xAxis.min === 0) return 0;
    return xAxis.min || points[0].x;
  };

  const getMinY = () => {
    if (yAxis.min === 0) return 0;
    return yAxis.min || Math.min(...points.map((p) => p.y));
  };

  const minX = getMinX();
  const maxX = xAxis.max ? xAxis.max : points[points.length - 1].x;

  const minY = getMinY();
  const maxY = yAxis.max ? yAxis.max : Math.max(...points.map((p) => p.y));

  const xTicks = getTicks(minX, maxX);
  const yTicks = getTicks(minY, maxY);

  const scaleY = 10 / (maxY - minY);

  return { xTicks, yTicks, scaleY };
};

export default useAxisTicks;
