import { useEffect } from "react";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";

export const useVerticalChartStore = create<MarkersStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: "",
  legend: "Plane",
  set: (value) => set(value),
}));

const useVerticalCharts = () => {
  const yHover = useVerticalChartStore((state) => state.yHover);

  const legend = useVerticalChartStore((state) => state.legend) as string;
  const locked = useVerticalChartStore((state) => state.locked);
  const setCharts = useVerticalChartStore((state) => state.set);

  const reversed = usePlaneCoefficientsStore((state) => state.reversed);
  const reversedVertical = usePlaneCoefficientsStore(
    (state) => state.reversedVertical
  );

  const cd: Record<string, number[][]> = {
    Plane: reversed,
    Stabilizer: reversedVertical,
  };

  useEffect(() => {
    const Cl = yHover;
    const Cd = linearInterpolationArray(cd[legend], Cl);
    locked !== "Coefficient of Lift" &&
      setCharts({
        x: { "Coefficient of Lift": 2, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [reversed, legend, yHover]);
};

export default useVerticalCharts;
