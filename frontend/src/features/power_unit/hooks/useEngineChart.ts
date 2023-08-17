import { useEffect, useMemo } from "react";
import { useEngineStore } from "../stores/useEngine";
import { usePower } from "./usePower";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { create } from "zustand";
import { SimpleMarkerStore } from "../../common/three/Hover";

const useEngineChartStore = create<SimpleMarkerStore>()((set) => ({
  x: 2,
  y: 2,
  hover: false,
  show: false,
  locked: false,
  set: (value) => set(value),
}));

const useEngineChart = () => {
  const x = useEngineChartStore((state) => state.x);
  const setChart = useEngineChartStore((state) => state.set);

  const heights = useEngineStore((state) => state.heights);
  const [calculatePower] = usePower();

  const points = useMemo(
    () => heights.map((x) => [x, calculatePower(x), 0]),
    [calculatePower]
  );

  useEffect(() => {
    const y = linearInterpolationArray(points, x);
    setChart({ y });
  }, [points, x]);

  return { points, useEngineChartStore };
};

export default useEngineChart;
