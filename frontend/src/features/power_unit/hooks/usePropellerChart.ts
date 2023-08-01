import { useMemo } from "react";
import { data } from "../data/prop";
import { Trace } from "../three/LineChart";

const usePropellerChart = () => {
  const traces = useMemo<Trace[]>(
    () => [
      {
        name: "2",
        points: data.cn.map((x, index) => [x, data[2][index], 0]),
      },
      {
        name: "3",
        points: data.cn.map((x, index) => [x, data[3][index], 0]),
      },
      {
        name: "4",
        points: data.cn.map((x, index) => [x, data[4][index], 0]),
      },
    ],
    []
  );
  return traces;
};

export default usePropellerChart;
