import { useMemo } from "react";
import { data } from "../data/prop";

const usePropellerChart = () => {
  const points = useMemo(
    () => data.cn.map((x, index) => [x, data[2][index], 0]),
    []
  );
  return points;
};

export default usePropellerChart;
