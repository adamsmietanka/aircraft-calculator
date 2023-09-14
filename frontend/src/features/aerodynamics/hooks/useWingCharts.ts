import { useEffect } from "react";
import { useWingStore } from "../stores/useWing";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import useWingAerodynamics from "./useWingAerodynamics";
import useReversedData from "../../common/hooks/useReversedData";

export const useWingChartsStore = create<MarkersStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  hover: { "Coefficient of Lift": false, "Coefficient of Drag": false },
  show: false,
  locked: "",
  set: (value) => set(value),
}));

const useWingCharts = () => {
  const wing = useWingStore();

  const x = useWingChartsStore((state) => state.x);
  const y = useWingChartsStore((state) => state.y);
  const hover = useWingChartsStore((state) => state.hover);
  const locked = useWingChartsStore((state) => state.locked);
  const setCharts = useWingChartsStore((state) => state.set);

  const { wingCl, wingCd } = useWingAerodynamics();

  const { clMonotonic: pointsClMonotonic, cdReversed: pointsCdReversed } =
    useReversedData(wingCl, wingCd);

  useEffect(() => {
    let aoa, Cd, Cl;
    if (locked === "Coefficient of Lift" || hover["Coefficient of Lift"]) {
      aoa = x["Coefficient of Lift"];
      Cl = linearInterpolationArray(wingCl, aoa);
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
    wing,
    x["Coefficient of Lift"],
    y["Coefficient of Drag"],
  ]);

  return { useWingChartsStore };
};

export default useWingCharts;
