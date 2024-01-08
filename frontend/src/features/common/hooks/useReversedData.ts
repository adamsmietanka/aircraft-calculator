const useReversedData = (cl: number[][], cd: number[][]) => {
  console.log(123);
  const lowest = cl.reduce((previous, current) =>
    current[1] < previous[1] ? current : previous
  );
  const highest = cl.reduce((previous, current) =>
    current[1] > previous[1] ? current : previous
  );

  return {
    clMonotonic: cl
      .filter((p) => lowest[0] < p[0] && p[0] < highest[0])
      .map((p) => [p[1], p[0], p[2]]),
    cdReversed: cd.map(([y, x]) => [x, y, 0]),
  };
};

export default useReversedData;
