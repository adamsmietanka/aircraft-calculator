import { useEffect, useMemo } from "react";
import { data } from "../data/prop";
import { Point, Trace } from "../three/LineChart";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { SimpleMarkerStore } from "../../common/three/Hover";

const usePropellerChartStore = create<SimpleMarkerStore>()((set) => ({
  x: 2,
  y: 2,
  hover: false,
  show: false,
  locked: false,
  set: (value) => set(value),
}));

const usePropellerChart = ({ x, y }: Point) => {
  const hover = usePropellerChartStore((state) => state.hover);
  const xHover = usePropellerChartStore((state) => state.x);
  const set = usePropellerChartStore((state) => state.set);

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
      const y = linearInterpolationArray(traces[0].points, xHover);
      set({ locked: false, y });
    } else {
      set({ locked: true, x, y });
    }
  }, [traces, xHover, hover, x, y]);

  return { traces, usePropellerChartStore };
};

export default usePropellerChart;
