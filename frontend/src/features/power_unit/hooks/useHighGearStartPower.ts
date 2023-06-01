import { useCallback, useEffect } from "react";
import { useEngineStore } from "../stores/useEngine";
import { useSuperchargerStore } from "../stores/useSupercharger";

export const useHighGearStartPower = () => {
  const kCoefficient = useEngineStore((state) => state.kCoefficient);
  const endAltitude = useSuperchargerStore(
    (state) => state.lowGear.endAltitude
  );
  const endPower = useSuperchargerStore((state) => state.lowGear.endPower);
  const startAltitude = useSuperchargerStore(
    (state) => state.highGear.startAltitude
  );
  const setHGstartPower = useSuperchargerStore(
    (state) => state.setHGstartPower
  );
  const superchargerEnabled = useSuperchargerStore((state) => state.enabled);

  const curvePower = useCallback(
    (curveStart: number, curveStartPower: number, height: number) => {
      // International Standard atmosphere
      const sigma = ((44.3 - height) / (44.3 - curveStart)) ** 4.256;
      return curveStartPower * ((sigma - kCoefficient) / (1 - kCoefficient));
    },
    [kCoefficient]
  );

  useEffect(() => {
    superchargerEnabled &&
      setHGstartPower(curvePower(endAltitude, endPower, startAltitude));
  }, [
    endAltitude,
    endPower,
    startAltitude,
    superchargerEnabled,
    setHGstartPower,
    curvePower,
  ]);
};
