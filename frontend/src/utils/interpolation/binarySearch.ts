export const findUpperBound = (arr: number[], target: number): number => {
  let low = 0;
  let high = arr.length - 1;
  let upperBound = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] >= target) {
      high = mid - 1; // Target is in the left half of the array
      upperBound = mid; // Update the lower bound
    } else {
      low = mid + 1;
    }
  }

  return upperBound;
};

const findAngleUpperBound = (
  i: number,
  normalizedX: number,
  Z: number[][],
  z: number
) => {
  let j = 0;
  let k = 51;
  while (j < k) {
    const h = Math.floor((j + k) / 2);
    const zBound = (1 - normalizedX) * Z[h][i - 1] + normalizedX * Z[h][i];
    if (zBound < z) {
      j = h + 1;
    } else {
      k = h;
    }
  }
  return j;
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

export const barycentricAngle = (
  X: number[],
  Y: number[],
  Z: number[][],
  x: number,
  z: number
): number => {
  // binary search for x upper bound
  let i = findUpperBound(X, x);

  if (x < 0 || i === X.length) {
    return 0;
  }
  if (x === 0) {
    i += 1;
  }

  // binary search for y upper bound
  const normalizedX = (x - X[i - 1]) / (X[i] - X[i - 1]);
  const j = findAngleUpperBound(i, normalizedX, Z, z);
  if (j === 0 || j === Z.length) {
    return 0;
  }

  // d---c
  // |  /|
  // | / |
  // |/  |
  // a---b
  const a = Z[j - 1][i - 1];
  const b = Z[j - 1][i];
  const c = Z[j][i];
  const d = Z[j][i - 1];

  // interpolate the z coord of the triangle boundary from the normalizedX
  const triangleBoundary = (1 - normalizedX) * a + normalizedX * c;
  if (z < triangleBoundary) {
    // lower triangle /_|
    const A = (X[i] - X[i - 1]) * (c - b);
    const w1 = ((a - b) * (x - X[i]) + (X[i] - X[i - 1]) * (z - b)) / A;
    return Y[j - 1] + w1 * (Y[j] - Y[j - 1]);
  }
  // upper triangle |/
  const A = (X[i] - X[i - 1]) * (a - d);
  const w2 = ((d - c) * (x - X[i - 1]) + (X[i] - X[i - 1]) * (z - d)) / A;
  return Y[j] - w2 * (Y[j] - Y[j - 1]);
};

export const barycentricZ = (
  X: number[],
  Y: number[],
  Z: number[][],
  x: number,
  y: number
) => {
  // binary search for x upper bound
  let i = findUpperBound(X, x);

  if (x < 0 || i === X.length) {
    return 0;
  }
  if (x === 0) {
    i += 1;
  }

  // binary search for y upper bound
  let j = findUpperBound(Y, y);

  if (y < 10 || j === Y.length) {
    return 0;
  }
  if (y === 10) {
    j += 1;
  }
  const normalizedX = (x - X[i - 1]) / (X[i] - X[i - 1]);
  const triangleBound = (1 - normalizedX) * Y[j - 1] + normalizedX * Y[j];

  if (y < triangleBound) {
    // lower triangle /_|
    const w1 = (y - Y[j - 1]) / (Y[j] - Y[j - 1]);
    const w2 = (X[i] - x) / (X[i] - X[i - 1]);
    const w3 = 1 - w1 - w2;
    return Z[j][i] * w1 + Z[j - 1][i - 1] * w2 + Z[j - 1][i] * w3;
  }
  // upper triangle |/
  const w1 = (x - X[i - 1]) / (X[i] - X[i - 1]);
  const w2 = (y - Y[j]) / (Y[j - 1] - Y[j]);
  const w3 = 1 - w1 - w2;
  return Z[j][i] * w1 + Z[j - 1][i - 1] * w2 + Z[j][i - 1] * w3;
};
