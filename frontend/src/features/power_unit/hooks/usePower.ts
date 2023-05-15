import { useTurbochargerStore } from "./useTurbocharger";
import { useCallback } from "react";
import { useEngineStore } from "./useEngine";
import { GearState, useSuperchargerStore } from "./useSupercharger";

const linePower = (gear: GearState, height: number) => {
  const { startPower, endPower, startAltitude, endAltitude } = gear;
  const a = (endPower - startPower) / (endAltitude - startAltitude);
  return startPower + a * (height - startAltitude);
};

export const usePower = () => {
  const engine = useEngineStore();
  const turbocharger = useTurbochargerStore();
  const supercharger = useSuperchargerStore();

  const curvePower = useCallback(
    (curveStart: number, curveStartPower: number, height: number) => {
      // International Standard atmosphere
      const sigma = ((44.3 - height) / (44.3 - curveStart)) ** 4.256;
      return (
        curveStartPower *
        ((sigma - engine.kCoefficient) / (1 - engine.kCoefficient))
      );
    },
    [engine.kCoefficient]
  );

  const powerTurbocharged = useCallback(
    (height: number) => {
      if (turbocharger.enabled) {
        if (height <= turbocharger.endAltitude) {
          return engine.seaLevelPower;
        }
        return curvePower(
          turbocharger.endAltitude,
          engine.seaLevelPower,
          height
        );
      }
      return 0;
    },
    [engine, turbocharger, curvePower]
  );

  const powerSupercharged = useCallback(
    (height: number) => {
      const { lowGear, highGear } = supercharger;
      if (supercharger.enabled) {
        if (height <= lowGear.endAltitude) {
          return linePower(lowGear, height);
        }

        if (highGear.enabled) {
          if (height <= highGear.startAltitude) {
            return curvePower(lowGear.endAltitude, lowGear.endPower, height);
          } else if (height <= highGear.endAltitude) {
            return linePower(highGear, height);
          }
          return curvePower(highGear.endAltitude, highGear.endPower, height);
        }

        return curvePower(lowGear.endAltitude, lowGear.endPower, height);
      }
      return curvePower(0, engine.seaLevelPower, height);
    },
    [supercharger, engine.seaLevelPower, curvePower]
  );

  const calculatePower = useCallback(
    (height: number) => {
      const turbo = powerTurbocharged(height);
      const compressor = powerSupercharged(height);
      return Math.max(turbo, compressor);
    },
    [powerSupercharged, powerTurbocharged]
  );
  return [calculatePower];
};

// function curveAltitude(curveStart, curveStartPower, power, k) {
//   // International Standard atmosphere
//   const sigma = (power / curveStartPower) * (1 - k) + k;
//   return (curveStart - 44.3) * sigma ** (1 / 4.256) + 44.3;
// }

// function lineAltitude(stage, power) {
//   const a =
//     (stage.endPower - stage.startPower) / (stage.endAlt - stage.startAlt);
//   return (power - stage.startPower) / a + stage.startAlt;
// }
