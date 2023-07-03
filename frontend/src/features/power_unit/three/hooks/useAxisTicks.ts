import { Point } from "../Chart2D";

const useAxisTicks = (points: Point[]) => {
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

  const minX = points[0].x;
  const maxX = points[points.length - 1].x;

  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));

  const markersX = getTicks(minX, maxX);
  const markersY = getTicks(minY, maxY);

  //   console.log(step, (min * 1) / step, markers);

  return [markersX, markersY];
};

export default useAxisTicks;
