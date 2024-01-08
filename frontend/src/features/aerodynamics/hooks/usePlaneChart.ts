import { useEffect } from "react";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import { usePlaneStore } from "../stores/usePlane";
import { useWingCoefficientsStore } from "../stores/useWingCoefficients";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";

export const usePlaneChartStore = create<MarkersStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: "",
  legend: "Plane",
  set: (value) => set(value),
}));

const usePlaneCharts = () => {
  const yHover = usePlaneChartStore((state) => state.yHover);

  const legend = usePlaneChartStore((state) => state.legend) as string;
  const locked = usePlaneChartStore((state) => state.locked);
  const setCharts = usePlaneChartStore((state) => state.set);

  const reversed = usePlaneCoefficientsStore((state) => state.reversed);
  const reversedFuse = usePlaneCoefficientsStore((state) => state.reversedFuse);
  const wingCdReversed = useWingCoefficientsStore((state) => state.reversed);

  const cd: Record<string, number[][]> = {
    Plane: reversed,
    Fuselage: reversedFuse,
    Wing: wingCdReversed,
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

  return { usePlaneChartStore };
};

export default usePlaneCharts;
