const linearRegression = (points: number[][]) => {
  const X = points.map(([x, y]) => x);
  const Y = points.map(([x, y]) => y);
  const x_mean = X.reduce((a, b) => a + b, 0) / X.length;
  const y_mean = Y.reduce((a, b) => a + b, 0) / Y.length;

  //Equations to solve for slope:
  let slope = 0,
    slope_numerator = 0,
    slope_denominator = 0;
  for (let i = 0; i < X.length; i++) {
    slope_numerator += (X[i] - x_mean) * (Y[i] - y_mean);
    slope_denominator += Math.pow(X[i] - x_mean, 2);
  }

  return slope_numerator / slope_denominator;
};
export default linearRegression;
