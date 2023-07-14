import { useMemo } from "react";
import { useEngineStore } from "../stores/useEngine";
import { usePower } from "./usePower";

const useEngineChart = () => {
  const heights = useEngineStore((state) => state.heights);
  const [calculatePower] = usePower();

  const points = useMemo(
    () => heights.map((x) => [x, calculatePower(x), 0]),
    [calculatePower]
  );
  return points;
};

export default useEngineChart;
