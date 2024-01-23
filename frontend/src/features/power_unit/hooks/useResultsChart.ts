import { useEffect, useMemo } from "react";
import { useResultsStore } from "../stores/useResults";
import { Trace } from "../../common/three/LineChart";
import { create } from "zustand";
import { linearInterpolationArray } from "../../../utils/interpolation/binarySearchArray";
import { SynchronizedXMarkersStore } from "../../common/three/Hover";

const useResultsChartStore = create<SynchronizedXMarkersStore>()((set) => ({
  x: 2,
  y: { "Propeller Power": 2, "Propeller Angle": 2 },
  xHover: 0,
  hover: false,
  show: false,
  locked: false,
  set: (value) => set(value),
}));

const useResultsChart = () => {
  const table = useResultsStore((state) => state.table);

  const xHover = useResultsChartStore((state) => state.xHover);
  const setCharts = useResultsChartStore((state) => state.set);

  const tracesPower = useMemo<Trace[]>(
    () => [
      {
        name: "power",
        points: table.map(({ v, prop_power }) => [v, prop_power, 0]),
      },
    ],
    [table]
  );

  const tracesAngle = useMemo<Trace[]>(
    () => [
      {
        name: "angle",
        points: table.map(({ v, angle }) => [v, angle, 0]),
      },
    ],
    [table]
  );

  const tracesRPM = useMemo<Trace[]>(
    () => [
      {
        name: "RPM",
        points: table.map(({ v, rpm }) => [v, rpm, 0]),
      },
    ],
    [table]
  );

  const tracesCp = useMemo<Trace[]>(
    () => [
      {
        name: "Cp",
        points: table.map(({ v, cp }) => [v, cp, 0]),
      },
    ],
    [table]
  );

  useEffect(() => {
    if (tracesPower[0].points.length) {
      const yPower = linearInterpolationArray(tracesPower[0].points, xHover);
      const yAngle = linearInterpolationArray(tracesAngle[0].points, xHover);
      const yRPM = linearInterpolationArray(tracesRPM[0].points, xHover);
      const yCp = linearInterpolationArray(tracesCp[0].points, xHover);
      setCharts({
        x: xHover,
        y: {
          "Propeller Power": yPower,
          "Propeller Angle": yAngle,
          "Propeller Speed": yRPM,
          "Coefficient of Power": yCp,
        },
        show: true,
      });
    }
  }, [xHover, table]);

  return {
    tracesPower,
    tracesAngle,
    tracesRPM,
    tracesCp,
    useResultsChartStore,
  };
};

export default useResultsChart;
