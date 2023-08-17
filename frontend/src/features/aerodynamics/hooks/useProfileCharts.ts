import { useEffect, useMemo } from "react";
import { useWingStore } from "../stores/useWing";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import useProfileData from "./useProfileData";

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

  const { pointsCl, pointsCd, pointsClMonotonic, pointsCdReversed } =
    useProfileData(wing.reynolds);

  useEffect(() => {
    let aoa, Cd, Cl;
    if (locked === "Coefficient of Lift" || hover["Coefficient of Lift"]) {
      aoa = x["Coefficient of Lift"];
      Cl = linearInterpolationArray(pointsCl, aoa);
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
  }, [
    wing.profile,
    wing.reynolds,
    x["Coefficient of Lift"],
    y["Coefficient of Drag"],
  ]);

  return { pointsCl, pointsCd, useProfileChartsStore };
};

export default useProfileCharts;
