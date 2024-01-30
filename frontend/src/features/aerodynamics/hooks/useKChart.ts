import { SimpleMarkerStore } from "../../common/three/Hover";
import { useEffect } from "react";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import { usePlaneStore } from "../stores/usePlane";
import { useGlideChartStore } from "./useGlideChart";

export const useKChartStore = create<SimpleMarkerStore>()((set) => ({
  x: 2,
  y: 2,
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: false,
  legend: "K",
  set: (value) => set(value),
}));

const useKChart = () => {
  const xHover = useKChartStore((state) => state.xHover);
  const hover = useKChartStore((state) => state.hover);

  const legend = useKChartStore((state) => state.legend) as string;
  const locked = useKChartStore((state) => state.locked);
  const setCharts = useKChartStore((state) => state.set);
  const setGlideChart = useGlideChartStore((state) => state.set);

  const k = usePlaneCoefficientsStore((state) => state.k);

  const kMax = usePlaneStore((state) => state.kMax);
  const angleOpt = usePlaneStore((state) => state.angleOpt);

  useEffect(() => {
    const aoa = xHover;
    const K = linearInterpolationArray(k, aoa);
    K > 0 && setCharts({ x: aoa, y: K });
  }, [legend, xHover]);

  useEffect(() => {
    !hover && !locked && setCharts({ x: angleOpt, y: kMax, locked: true });
    if (hover) {
      setCharts({ locked: false });
      setGlideChart({ legend: "Current" });
    }
  }, [k, hover, kMax]);
};

export default useKChart;
