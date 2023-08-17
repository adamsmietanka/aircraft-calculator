import { useEffect, useState } from "react";
import { useGlobalUnitsStore } from "../stores/useGlobalUnits";
import { unitMultipliers } from "../data/units";
import { getStep } from "../../common/three/hooks/useAxes";

export const useUnits = (value: number, type: string) => {
  const types = useGlobalUnitsStore((state) => state.types);
  const system = useGlobalUnitsStore((state) => state.system);
  const setAltitude = useGlobalUnitsStore((state) => state.setAltitude);
  const setLength = useGlobalUnitsStore((state) => state.setLength);
  const setSpeed = useGlobalUnitsStore((state) => state.setSpeed);
  const setPower = useGlobalUnitsStore((state) => state.setPower);

  const [unit, setUnit] = useState(types[type]);

  const multiplier = unitMultipliers[type][unit];
  const step = getStep((0.1 * value) / multiplier);

  const displayValue = Math.round((value * 1000) / multiplier) / 1000;

  useEffect(() => {
    setUnit(() => types[type]);
  }, [types, type, setUnit]);

  useEffect(() => {
    setAltitude(system === "metric" ? "km" : "ft");
    setLength(system === "metric" ? "m" : "ft");
    setSpeed(system === "metric" ? "m/s" : "mph");
    setPower(system === "metric" ? "kW" : "hp");
  }, [system, setSpeed, setAltitude]);

  return {
    unit,
    setUnit,
    units: unitMultipliers[type],
    multiplier,
    step,
    displayValue,
  };
};
