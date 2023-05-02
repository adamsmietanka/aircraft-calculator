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

export function curvePower(
  x: number,
  k: number,
  curveStartPower = 1000,
  curveStart = 0
) {
  // International Standard atmosphere
  const sigma = ((44.3 - x) / (44.3 - curveStart)) ** 4.256;
  return curveStartPower * ((sigma - k) / (1 - k));
}

// function curveAltitude(curveStart, curveStartPower, power, k) {
//   // International Standard atmosphere
//   const sigma = (power / curveStartPower) * (1 - k) + k;
//   return (curveStart - 44.3) * sigma ** (1 / 4.256) + 44.3;
// }

// function linePower(stage, x) {
//   const a =
//     (stage.endPower - stage.startPower) / (stage.endAlt - stage.startAlt);
//   return stage.startPower + a * (x - stage.startAlt);
// }

// function lineAltitude(stage, power) {
//   const a =
//     (stage.endPower - stage.startPower) / (stage.endAlt - stage.startAlt);
//   return (power - stage.startPower) / a + stage.startAlt;
// }
