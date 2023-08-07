const findUpperBoundArray = (
  arr: number[][],
  target: number,
  axis = 0
): number => {
  let low = 0;
  let high = arr.length - 1;
  let upperBound = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid][axis] >= target) {
      high = mid - 1; // Target is in the left half of the array
      upperBound = mid; // Update the lower bound
    } else {
      low = mid + 1;
    }
  }

  return upperBound;
};

export const linearInterpolationArray = (
  points: number[][],
  x: number
): number => {
  const index = findUpperBoundArray(points, x);
  
  if (index === 0) return points[0][1];
  if (index === points.length - 1) return points[points.length - 1][1];
  
  const [x0, y0] = points[index - 1];
  const [x1, y1] = points[index];

  if (x0 === x1 || x1 === undefined) {
    return y0; // Avoid division by zero
  }

  const y = y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  return y;
};
