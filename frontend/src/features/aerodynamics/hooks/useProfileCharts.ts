import { useEffect, useMemo } from "react";
import { useWingStore } from "../stores/useWing";
import profiles from "../data/profiles_interpolated";
import { create } from "zustand";
import { ChartStore } from "../../power_unit/PowerUnitEngine";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";

export const useProfileChartsStore = create<ChartStore>()((set) => ({
  x: 2,
  y: 2,
  hover: false,
  show: false,
  locked: false,
  setX: (value) => set({ x: value }),
  setY: (value) => set({ y: value }),
  setLocked: (value) => set({ locked: value }),
  set: (value) => set(value),
}));

const useProfileCharts = () => {
  const wing = useWingStore();

  const storeInstance = useProfileChartsStore();
  const x = useProfileChartsStore((state) => state.x);
  const setCharts = useProfileChartsStore((state) => state.set);

  const points = useMemo(() => {
    const filtered = profiles[wing.profile].cz;
    return filtered.map(([x, y, y2]) => [x, y, 0]);
  }, [wing.profile]);

  const pointsCd = useMemo(() => {
    const filtered = profiles[wing.profile].cd;
    return filtered.map(([x, y, y2]) => [x, y, 0]);
  }, [wing.profile]);

  useEffect(() => {
    const y = linearInterpolationArray(points, x);
    setCharts({ y });
  }, [points, x]);

  return { points, pointsCd, useProfileChartsStore };
};

export default useProfileCharts;
