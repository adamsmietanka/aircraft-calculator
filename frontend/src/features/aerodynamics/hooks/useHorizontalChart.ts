import { useEffect } from "react";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { MarkersStore } from "../../common/three/Hover";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";

export const useHorizontalChartStore = create<MarkersStore>()((set) => ({
  x: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  y: { "Coefficient of Lift": 2, "Coefficient of Drag": 2 },
  xHover: 0,
  yHover: 0,
  hover: false,
  locked: "",
  legend: "Plane",
  set: (value) => set(value),
}));

const useHorizontalCharts = () => {
  const xHover = useHorizontalChartStore((state) => state.xHover);
  const yHover = useHorizontalChartStore((state) => state.yHover);

  const legend = useHorizontalChartStore((state) => state.legend) as string;
  const locked = useHorizontalChartStore((state) => state.locked);
  const setCharts = useHorizontalChartStore((state) => state.set);

  const clPlane = usePlaneCoefficientsStore((state) => state.cl);
  const clHorizontal = usePlaneCoefficientsStore((state) => state.clHorizontal);
  const monotonic = usePlaneCoefficientsStore((state) => state.monotonic);
  const monotonicHorizontal = usePlaneCoefficientsStore(
    (state) => state.monotonicHorizontal
  );
  const reversed = usePlaneCoefficientsStore((state) => state.reversed);
  const reversedHorizontal = usePlaneCoefficientsStore(
    (state) => state.reversedHorizontal
  );

  const cl: Record<string, number[][]> = {
    Plane: clPlane,
    Stabilizer: clHorizontal,
  };

  const cd: Record<string, number[][]> = {
    Plane: reversed,
    Stabilizer: reversedHorizontal,
  };
  const clMonotonic: Record<string, number[][]> = {
    Profile: monotonic,
    Stabilizer: monotonicHorizontal,
  };

  // useEffect(() => {
  //   const aoa = xHover;
  //   const Cl = linearInterpolationArray(cl[legend], aoa);
  //   const Cd = linearInterpolationArray(cd[legend], Cl);
  //   locked !== "Coefficient of Drag" &&
  //     setCharts({
  //       x: { "Coefficient of Lift": aoa, "Coefficient of Drag": Cd },
  //       y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
  //     });
  // }, [monotonic, legend, xHover]);

  useEffect(() => {
    const Cl = yHover;
    const Cd = linearInterpolationArray(cd[legend], Cl);
    // const aoa = linearInterpolationArray(clMonotonic[legend], Cl);
    locked !== "Coefficient of Lift" &&
      setCharts({
        x: { "Coefficient of Lift": 2, "Coefficient of Drag": Cd },
        y: { "Coefficient of Lift": Cl, "Coefficient of Drag": Cl },
      });
  }, [reversed, reversedHorizontal, legend, yHover]);
};

export default useHorizontalCharts;
