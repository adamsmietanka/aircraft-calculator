import { useEffect, useMemo } from "react";
import { useEngineStore } from "../stores/useEngine";
import { usePower } from "./usePower";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { create } from "zustand";
import { SimpleMarkerStore } from "../../common/three/Hover";

export const useEngineChartStore = create<SimpleMarkerStore>()((set) => ({
  x: 2,
  y: 2,
  xHover: 0,
  yHover: 0,
  hover: false,
  show: false,
  locked: false,
  set: (value) => set(value),
}));

const useEngineChart = () => {
  const xHover = useEngineChartStore((state) => state.xHover);
  const setChart = useEngineChartStore((state) => state.set);

  const heights = useEngineStore((state) => state.heights);
  const [calculatePower] = usePower();

  const points = useMemo(
    () => heights.map((x) => [x, calculatePower(x), 0]),
    [calculatePower]
  );

  useEffect(() => {
    const y = linearInterpolationArray(points, xHover);
    setChart({ x: xHover, y });
  }, [points, xHover]);

  return { points };
};

export default useEngineChart;
