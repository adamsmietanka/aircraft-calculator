import { useCallback, useEffect } from "react";
import { useWingStore } from "../stores/useWing";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import useProfileData from "./useProfileData";
import useProfileCamber from "./useProfileCamber";
import clamp from "../../../utils/interpolation/clamp";
import useProfileInfo from "./useProfileInfo";
import { useProfileTabCoefficientsStore } from "../stores/useProfileTabCoefficients";

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
  const table = useProfileInfo();

  const xHover = useProfileChartsStore((state) => state.xHover);
  const yHover = useProfileChartsStore((state) => state.yHover);

  const locked = useProfileChartsStore((state) => state.locked);
  const setCharts = useProfileChartsStore((state) => state.set);

  const profileCl = useProfileTabCoefficientsStore((state) => state.cl);
  const profileClMonotonic = useProfileTabCoefficientsStore(
    (state) => state.monotonic
  );
  const profileCdReversed = useProfileTabCoefficientsStore(
    (state) => state.reversed
  );

  useProfileData();

  const { M } = useProfileCamber();

  const getCl = useCallback(
    (aoa: number) => {
      if (M === 0 && aoa === 0) return 0;
      return linearInterpolationArray(profileCl, aoa);
    },
    [profileCl]
  );

  useEffect(() => {
    const aoa = clamp(xHover, table.minAngle, table.maxAngle);
    const Cl = getCl(xHover);
    let Cd;
    if (aoa < table.angleOfMinCz) {
      const delta = table.angleOfMinCz - aoa;
      Cd =
        linearInterpolationArray(profileCdReversed, table.angleOfMinCz) +
        0.01 * delta;
    } else if (table.angleOfMaxCz < aoa) {
      const delta = aoa - table.angleOfMaxCz;
      Cd =
        linearInterpolationArray(profileCdReversed, table.angleOfMaxCz) +
        0.01 * delta;
    } else {
      Cd = linearInterpolationArray(profileCdReversed, Cl);
    }
    locked !== "Coefficient of Drag" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [profileCl, xHover]);

  useEffect(() => {
    const Cl = clamp(yHover, table.minCz, table.maxCz);
    const Cd = linearInterpolationArray(profileCdReversed, Cl);
    const aoa = linearInterpolationArray(profileClMonotonic, Cl);
    locked !== "Coefficient of Lift" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [profileCl, yHover]);
};

export default useProfileCharts;
