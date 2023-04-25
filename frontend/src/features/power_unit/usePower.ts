import { useCallback } from "react";
import { useEngineStore } from "./useEngine";

export const usePower = () => {
  const engine = useEngineStore();
  const calculatePower = useCallback(
    (height: number) => {
      console.log("reused");
      return curvePower(height, engine.kCoefficient);
    },
    [engine]
  );
  return [calculatePower];
};

export function curvePower(x: number, k: number, curveStart = 0, curveStartPower = 1000) {
    // International Standard atmosphere
    const sigma = ((44.3 - x) / (44.3 - curveStart)) ** 4.256;
    return curveStartPower * ((sigma - k) / (1 - k));
  }