import { SimpleMarkerStore } from "./../../common/three/Hover";
import { useEffect } from "react";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import { usePlaneStore } from "../stores/usePlane";
import { linearInterpolation } from "../../../utils/interpolation/binarySearch";
import { useKChartStore } from "./useKChart";

export const useGlideChartStore = create<SimpleMarkerStore>()((set) => ({
  x: 2,
  y: 2,
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: false,
  legend: "Optimal",
  set: (value) => set(value),
}));

const useGlideChart = () => {
  const x = useGlideChartStore((state) => state.xHover);
  const hover = useGlideChartStore((state) => state.hover);
  const kHover = useKChartStore((state) => state.y);

  const legend = useGlideChartStore((state) => state.legend) as string;
  const locked = useGlideChartStore((state) => state.locked);
  const setCharts = useGlideChartStore((state) => state.set);

  const k = usePlaneCoefficientsStore((state) => state.k);

  const kMax = usePlaneStore((state) => state.kMax);
  const angleOpt = usePlaneStore((state) => state.angleOpt);

  useEffect(() => {
    const y = linearInterpolation(
      0,
      1,
      legend === "Optimal" ? kMax : kHover,
      0,
      x
    );
    setCharts({ x, y });
  }, [legend, x, kHover]);

  useEffect(() => {
    // !hover && setCharts({ x: 0, y: 1 });
    // hover && setCharts({ locked: false });
  }, [k, hover, kMax]);
};

export default useGlideChart;
