export const findLowerBound = (arr: number[], target: number): number => {
  let low = 0;
  let high = arr.length - 1;
  let lowerBound = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] >= target) {
      high = mid - 1; // Target is in the left half of the array
      lowerBound = mid; // Update the lower bound
    } else {
      low = mid + 1;
    }
  }

  return lowerBound;
};

export const linearInterpolation = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x: number
): number => {
  if (x0 === x1) {
    return y0; // Avoid division by zero
  }

  const y = y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  return y;
};
