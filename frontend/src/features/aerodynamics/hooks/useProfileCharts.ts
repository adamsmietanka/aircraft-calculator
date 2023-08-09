import { useEffect, useMemo } from "react";
import { useWingStore } from "../stores/useWing";
import profiles from "../data/profiles_interpolated";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";

export const useProfileChartsStore = create<MarkersStore>()((set) => ({
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
  const y = useProfileChartsStore((state) => state.y);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);
  const setCharts = useProfileChartsStore((state) => state.set);

  const points = useMemo(
    () =>
      profiles[wing.profile].cz[wing.reynolds].map(([x, y]) => [x, y, 0]),
    [wing.profile, wing.reynolds]
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
    () =>
      profiles[wing.profile].cd[wing.reynolds].map(([x, y]) => [y, x, 0]),
    [wing.profile, wing.reynolds]
  );

  const pointsCdReversed = useMemo(
    () => pointsCd.map(([y, x]) => [x, y, 0]),
    [pointsCd]
  );

  useEffect(() => {
    let aoa, Cd, Cl;
    if (locked === "Coefficient of Lift" || hover["Coefficient of Lift"]) {
      aoa = x["Coefficient of Lift"];
      Cl = linearInterpolationArray(points, aoa);
      Cd = linearInterpolationArray(pointsCdReversed, Cl);
    } else {
      Cl = y["Coefficient of Drag"];
      Cd = linearInterpolationArray(pointsCdReversed, Cl);
      aoa = linearInterpolationArray(pointsClMonotonic, Cl);
    }
    setCharts({
      x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
      y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
    });
  }, [points, x["Coefficient of Lift"], y["Coefficient of Drag"]]);

  return { points, pointsCd, useProfileChartsStore };
};

export default useProfileCharts;
