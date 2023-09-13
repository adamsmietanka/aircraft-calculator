import { useMemo } from "react";

const useReversedData = (cl: number[][], cd: number[][]) => {
  const clMonotonic = useMemo(() => {
    const lowest = cl.reduce((previous, current) =>
      current[1] < previous[1] ? current : previous
    );
    const highest = cl.reduce((previous, current) =>
      current[1] > previous[1] ? current : previous
    );

    return cl
      .filter((p) => lowest[0] < p[0] && p[0] < highest[0])
      .map((p) => [p[1], p[0], p[2]]);
  }, [cl]);

  const cdReversed = useMemo(() => cd.map(([y, x]) => [x, y, 0]), [cd]);
  return { clMonotonic, cdReversed };
};

export default useReversedData;
