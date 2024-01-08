import { useEffect } from "react";
import { useWingStore } from "../stores/useWing";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import { useProfileCoefficientsStore } from "../stores/useProfileCoefficients";
import { useWingCoefficientsStore } from "../stores/useWingCoefficients";

export const useWingChartsStore = create<MarkersStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: "",
  legend: "Wing",
  set: (value) => set(value),
}));

const useWingCharts = () => {
  const wing = useWingStore();

  const xHover = useWingChartsStore((state) => state.xHover);
  const yHover = useWingChartsStore((state) => state.yHover);

  const legend = useWingChartsStore((state) => state.legend) as string;
  const locked = useWingChartsStore((state) => state.locked);
  const setCharts = useWingChartsStore((state) => state.set);

  const profileCl = useProfileCoefficientsStore((state) => state.cl);
  const profileClMonotonic = useProfileCoefficientsStore(
    (state) => state.monotonic
  );
  const profileCdReversed = useProfileCoefficientsStore(
    (state) => state.reversed
  );

  const wingCl = useWingCoefficientsStore((state) => state.cl);
  const wingClMonotonic = useWingCoefficientsStore((state) => state.monotonic);
  const wingCdReversed = useWingCoefficientsStore((state) => state.reversed);
  const inducedCdReversed = useWingCoefficientsStore(
    (state) => state.reversedInduced
  );

  const cl: Record<string, number[][]> = {
    Profile: profileCl,
    Induced: wingCl,
    Wing: wingCl,
  };
  const cd: Record<string, number[][]> = {
    Profile: profileCdReversed,
    Induced: inducedCdReversed,
    Wing: wingCdReversed,
  };
  const clMonotonic: Record<string, number[][]> = {
    Profile: profileClMonotonic,
    Induced: wingClMonotonic,
    Wing: wingClMonotonic,
  };

  useEffect(() => {
    const aoa = xHover;
    const Cl = linearInterpolationArray(cl[legend], aoa);
    const Cd = linearInterpolationArray(cd[legend], Cl);
    locked !== "Coefficient of Drag" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [wing, legend, xHover]);

  useEffect(() => {
    const Cl = yHover;
    const Cd = linearInterpolationArray(cd[legend], Cl);
    const aoa = linearInterpolationArray(clMonotonic[legend], Cl);
    locked !== "Coefficient of Lift" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [wing, legend, yHover]);
};

export default useWingCharts;
