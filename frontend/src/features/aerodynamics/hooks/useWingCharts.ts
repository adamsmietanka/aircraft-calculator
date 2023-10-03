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
  xHover: 0,
  yHover: 0,
  hover: { "Coefficient of Lift": false, "Coefficient of Drag": false },
  show: false,
  locked: "",
  set: (value) => set(value),
}));

const useWingCharts = () => {
  const wing = useWingStore();

  const xHover = useWingChartsStore((state) => state.xHover);
  const yHover = useWingChartsStore((state) => state.yHover);

  const locked = useWingChartsStore((state) => state.locked);
  const setCharts = useWingChartsStore((state) => state.set);

  const { wingCl, wingCd } = useWingAerodynamics();

  const { clMonotonic: pointsClMonotonic, cdReversed: pointsCdReversed } =
    useReversedData(wingCl, wingCd);

  useEffect(() => {
    const aoa = xHover;
    const Cl = linearInterpolationArray(wingCl, aoa);
    const Cd = linearInterpolationArray(pointsCdReversed, Cl);
    locked !== "Coefficient of Drag" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [wing.profile, wing.reynolds, xHover]);

  useEffect(() => {
    const Cl = yHover;
    const Cd = linearInterpolationArray(pointsCdReversed, Cl);
    const aoa = linearInterpolationArray(pointsClMonotonic, Cl);
    locked !== "Coefficient of Lift" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [wing.profile, wing.reynolds, yHover]);

  return { useWingChartsStore };
};

export default useWingCharts;
