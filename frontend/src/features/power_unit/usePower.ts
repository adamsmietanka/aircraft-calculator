import { useCallback } from "react";
import { useEngineStore } from "./useEngine";

export const usePower = () => {
  const engine = useEngineStore();
  const calculatePower = useCallback(
    (height: number) => {
      console.log("reused");
      return curvePower(height, engine.kCoefficient, engine.seaLevelPower);
    },
    [engine]
  );
  return [calculatePower];
};

export function curvePower(x: number, k: number, curveStartPower = 1000, curveStart = 0) {
    // International Standard atmosphere
    const sigma = ((44.3 - x) / (44.3 - curveStart)) ** 4.256;
    return curveStartPower * ((sigma - k) / (1 - k));
  }