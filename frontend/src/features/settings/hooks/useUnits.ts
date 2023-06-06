import { useEffect, useState } from "react";
import { useGlobalUnitsStore } from "../stores/useGlobalUnits";
import { unitData } from "../data/units";

export const useUnits = (value: number, type: string) => {
  const types = useGlobalUnitsStore((state) => state.types);
  const system = useGlobalUnitsStore((state) => state.system);
  const setSpeed = useGlobalUnitsStore((state) => state.setSpeed);
  const setAltitude = useGlobalUnitsStore((state) => state.setAltitude);

  const [unit, setUnit] = useState(types[type]);

  const { multiplier, step, round } = unitData[type][unit];
  const displayValue = round
    ? Math.round(value / multiplier)
    : Math.round(value / multiplier);

  useEffect(() => {
    setUnit(() => types[type]);
  }, [types, type, setUnit]);

  useEffect(() => {
    setSpeed(system === "metric" ? "m/s" : "mph");
    setAltitude(system === "metric" ? "km" : "ft");
  }, [system, setSpeed, setAltitude]);

  return {
    unit,
    setUnit,
    units: unitData[type],
    multiplier,
    step,
    displayValue,
  };
};
