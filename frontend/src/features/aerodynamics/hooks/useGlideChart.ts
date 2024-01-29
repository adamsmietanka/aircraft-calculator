import { useEffect } from "react";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import { usePlaneStore } from "../stores/usePlane";

export const useGlideChartStore = create<MarkersStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: "",
  legend: "K",
  set: (value) => set(value),
}));

const useGlideCharts = () => {
  const xHover = useGlideChartStore((state) => state.xHover);
  const yHover = useGlideChartStore((state) => state.yHover);
  const hover = useGlideChartStore((state) => state.hover);

  const legend = useGlideChartStore((state) => state.legend) as string;
  const locked = useGlideChartStore((state) => state.locked);
  const setCharts = useGlideChartStore((state) => state.set);

  const k = usePlaneCoefficientsStore((state) => state.k);
  const clHorizontal = usePlaneCoefficientsStore((state) => state.clHorizontal);
  const monotonic = usePlaneCoefficientsStore((state) => state.monotonic);
  const monotonicHorizontal = usePlaneCoefficientsStore(
    (state) => state.monotonicHorizontal
  );
  const reversed = usePlaneCoefficientsStore((state) => state.reversed);
  const reversedHorizontal = usePlaneCoefficientsStore(
    (state) => state.reversedHorizontal
  );

  const kMax = usePlaneStore((state) => state.kMax);
  const angleOpt = usePlaneStore((state) => state.angleOpt);

  // const cl: Record<string, number[][]> = {
  //   Plane: clPlane,
  //   Stabilizer: clHorizontal,
  // };

  // const cd: Record<string, number[][]> = {
  //   Plane: reversed,
  //   Stabilizer: reversedHorizontal,
  // };
  // const clMonotonic: Record<string, number[][]> = {
  //   Profile: monotonic,
  //   Stabilizer: monotonicHorizontal,
  // };

  useEffect(() => {
    const aoa = xHover;
    const K = linearInterpolationArray(k, aoa);
    console.log(xHover);
    // const Cd = linearInterpolationArray(cd[legend], Cl);
    locked !== "Coefficient of Drag" &&
      setCharts({
        x: { "Coefficient of Lift": aoa, "Coefficient of Drag": 2 },
        y: { "Coefficient of Lift": K, "Coefficient of Drag": K },
      });
  }, [k, legend, xHover]);

  useEffect(() => {
    !hover &&
      !locked &&
      setCharts({
        x: { "Coefficient of Lift": angleOpt, "Coefficient of Drag": 2 },
        y: { "Coefficient of Lift": kMax, "Coefficient of Drag": kMax },
        locked: "Coefficient of Lift",
      });
    hover &&
      setCharts({
        locked: "",
      });
  }, [hover, kMax]);

  // useEffect(() => {
  //   const Cl = yHover;
  //   const Cd = linearInterpolationArray(cd[legend], Cl);
  //   // const aoa = linearInterpolationArray(clMonotonic[legend], Cl);
  //   locked !== "Coefficient of Lift" &&
  //     setCharts({
  //       x: { "Coefficient of Lift": 2, "Coefficient of Drag": Cd },
  //       y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
  //     });
  // }, [reversed, reversedHorizontal, legend, yHover]);
};

export default useGlideCharts;
