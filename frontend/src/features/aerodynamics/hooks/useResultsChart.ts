import { useEffect } from "react";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";

export const useResultsChartStore = create<MarkersStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: "",
  legend: "Plane",
  set: (value) => set(value),
}));

const useResultsCharts = () => {
  const xHover = useResultsChartStore((state) => state.xHover);
  const yHover = useResultsChartStore((state) => state.yHover);

  const legend = useResultsChartStore((state) => state.legend) as string;
  const locked = useResultsChartStore((state) => state.locked);
  const setCharts = useResultsChartStore((state) => state.set);

  const cl = usePlaneCoefficientsStore((state) => state.cl);
  const monotonic = usePlaneCoefficientsStore((state) => state.monotonic);
  const reversed = usePlaneCoefficientsStore((state) => state.reversed);

  useEffect(() => {
    const aoa = xHover;
    const Cl = linearInterpolationArray(cl, aoa);
    const Cd = linearInterpolationArray(reversed, Cl);
    locked !== "Coefficient of Drag" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [monotonic, legend, xHover]);

  useEffect(() => {
    const Cl = yHover;
    const Cd = linearInterpolationArray(reversed, Cl);
    const aoa = linearInterpolationArray(monotonic, Cl);
    locked !== "Coefficient of Lift" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [reversed, monotonic, legend, yHover]);
};

export default useResultsCharts;
