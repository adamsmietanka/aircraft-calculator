import { useEffect, useMemo } from "react";
import { data } from "../data/prop";
import { Point, Trace } from "../three/LineChart";
import { create } from "zustand";
import { ChartStore } from "../PowerUnitEngine";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";

const usePropellerChartStore = create<ChartStore>()((set) => ({
  x: 2,
  y: 2,
  hover: false,
  locked: false,
  setX: (value) => set(() => ({ x: value })),
  setY: (value) => set(() => ({ y: value })),
  setLocked: (value) => set(() => ({ locked: value })),
}));

const usePropellerChart = ({ x, y }: Point) => {
  const hover = usePropellerChartStore((state) => state.hover);
  const xHover = usePropellerChartStore((state) => state.x);
  const setX = usePropellerChartStore((state) => state.setX);
  const setY = usePropellerChartStore((state) => state.setY);
  const setLocked = usePropellerChartStore((state) => state.setLocked);

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

  useEffect(() => {
    if (hover) {
      setLocked(false);
      const y = linearInterpolationArray(traces[0].points, xHover);
      setY(y);
    } else {
      setLocked(true);
      setX(x);
      setY(y);
    }
  }, [traces, xHover, hover, x, y]);

  return { traces, usePropellerChartStore };
};

export default usePropellerChart;
