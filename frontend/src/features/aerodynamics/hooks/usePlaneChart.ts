import { useEffect } from "react";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import useReversedData from "../../common/hooks/useReversedData";
import { usePlaneStore } from "../stores/usePlane";
import usePlaneAerodynamics from "./usePlaneAerodynamics";

export const usePlaneChartStore = create<MarkersStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: "",
  legend: "Wing",
  set: (value) => set(value),
}));

const usePlaneCharts = () => {
  const plane = usePlaneStore();

  const yHover = usePlaneChartStore((state) => state.yHover);

  const legend = usePlaneChartStore((state) => state.legend) as string;
  const locked = usePlaneChartStore((state) => state.locked);
  const setCharts = usePlaneChartStore((state) => state.set);

  const { cl, wingCd, cd: planeCd, fuseCd } = usePlaneAerodynamics();

  const { cdReversed: planeCdReversed } = useReversedData(cl, planeCd);
  const { cdReversed: fuseCdReversed } = useReversedData(cl, fuseCd);
  const { cdReversed: wingCdReversed } = useReversedData(cl, wingCd);

  const cd: Record<string, number[][]> = {
    Plane: planeCdReversed,
    Fuselage: fuseCdReversed,
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
  }, [plane, legend, yHover]);

  return { usePlaneChartStore };
};

export default usePlaneCharts;
