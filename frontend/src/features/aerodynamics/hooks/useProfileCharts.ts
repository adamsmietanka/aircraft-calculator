import { useEffect, useMemo } from "react";
import { useWingStore } from "../stores/useWing";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import useProfileData from "./useProfileData";
import { useProfileCamber } from "./useProfile";

export const useProfileChartsStore = create<MarkersStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: "",
  set: (value) => set(value),
}));

const useProfileCharts = () => {
  const wing = useWingStore();

  const xHover = useProfileChartsStore((state) => state.xHover);
  const yHover = useProfileChartsStore((state) => state.yHover);

  const locked = useProfileChartsStore((state) => state.locked);
  const setCharts = useProfileChartsStore((state) => state.set);

  const { pointsCl, pointsCd, pointsClMonotonic, pointsCdReversed } =
    useProfileData(wing.reynoldsIndex);

  const { M } = useProfileCamber();

  const getCl = (aoa: number) => {
    if (M === 0 && aoa === 0) return 0;
    return linearInterpolationArray(pointsCl, aoa);
  };

  useEffect(() => {
    const aoa = xHover;
    const Cl = getCl(xHover);
    const Cd = linearInterpolationArray(pointsCdReversed, Cl);
    locked !== "Coefficient of Drag" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [wing.profile, wing.reynoldsIndex, xHover]);

  useEffect(() => {
    const Cl = yHover;
    const Cd = linearInterpolationArray(pointsCdReversed, Cl);
    const aoa = linearInterpolationArray(pointsClMonotonic, Cl);
    locked !== "Coefficient of Lift" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [wing.profile, wing.reynoldsIndex, yHover]);

  return { pointsCl, pointsCd, useProfileChartsStore };
};

export default useProfileCharts;
