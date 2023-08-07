import { useEffect, useMemo } from "react";
import { useWingStore } from "../stores/useWing";
import profiles from "../data/profiles_interpolated";
import { create } from "zustand";
import { AnotherChartStore } from "../../power_unit/PowerUnitEngine";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";

export const useProfileChartsStore = create<AnotherChartStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  hover: { "Coefficient of Lift": false, "Coefficient of Drag": false },
  show: false,
  locked: "",
  set: (value) => set(value),
}));

const useProfileCharts = () => {
  const wing = useWingStore();

  const x = useProfileChartsStore((state) => state.x);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);
  const setCharts = useProfileChartsStore((state) => state.set);

  const points = useMemo(
    () => profiles[wing.profile].cz.map(([x, y, y2]) => [x, y, 0]),
    [wing.profile]
  );

  const pointsClMonotonic = useMemo(() => {
    const lowest = points.reduce((previous, current) => {
      if (current[1] < previous[1]) {
        return current;
      }
      return previous;
    });
    const highest = points.reduce((previous, current) => {
      if (current[1] > previous[1]) {
        return current;
      }
      return previous;
    });

    return points
      .filter((p) => lowest[0] < p[0] && p[0] < highest[0])
      .map((p) => [p[1], p[0], p[2]]);
  }, [points]);

  const pointsCd = useMemo(
    () => profiles[wing.profile].cd.map(([x, y, y2]) => [x, y, 0]),
    [wing.profile]
  );

  useEffect(() => {
    if (locked === "Coefficient of Lift" || hover["Coefficient of Lift"]) {
      const aoa = x["Coefficient of Lift"];
      const Cl = linearInterpolationArray(points, aoa);
      const Cd = linearInterpolationArray(pointsCd, Cl);
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cl },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cd },
      });
    }
    if (locked === "Coefficient of Drag" || hover["Coefficient of Drag"]) {
      const Cl = x["Coefficient of Drag"];
      const Cd = linearInterpolationArray(pointsCd, Cl);
      const aoa = linearInterpolationArray(pointsClMonotonic, Cl);
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cl },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cd },
      });
    }
  }, [
    points,
    pointsClMonotonic,
    hover["Coefficient of Lift"],
    x["Coefficient of Lift"],
    x["Coefficient of Drag"],
    locked,
  ]);

  return { points, pointsCd, useProfileChartsStore };
};

export default useProfileCharts;
