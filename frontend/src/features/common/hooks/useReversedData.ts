/**
 *
 * @param cl The Cl points to be turned into a monotonic array (only the linear part)
 * @param cd The Cd points to be reversed (x/y swapped)
 * @returns
 */
const useReversedData = (
  cl: number[][],
  cd: number[][]
): { monotonic: number[][]; reversed: number[][] } => {
  const lowest = cl.reduce((previous, current) =>
    current[1] < previous[1] ? current : previous
  );
  const highest = cl.reduce((previous, current) =>
    current[1] > previous[1] ? current : previous
  );

  return {
    monotonic: cl
      .filter((p) => lowest[0] < p[0] && p[0] < highest[0])
      .map((p) => [p[1], p[0], p[2]]),
    reversed: cd.map(([y, x]) => [x, y, 0]),
  };
};

export default useReversedData;
