import { useEffect, useState } from "react";
import { useGlobalUnitsStore } from "../stores/useGlobalUnits";
import { unitData } from "../data/units";

export const useUnits = (value: number, type: string) => {
  const types = useGlobalUnitsStore((state) => state.types);
  const system = useGlobalUnitsStore((state) => state.system);
  const setAltitude = useGlobalUnitsStore((state) => state.setAltitude);
  const setLength = useGlobalUnitsStore((state) => state.setLength);
  const setSpeed = useGlobalUnitsStore((state) => state.setSpeed);
  const setPower = useGlobalUnitsStore((state) => state.setPower);

  const [unit, setUnit] = useState(types[type]);

  const { multiplier, step } = unitData[type][unit];
  const displayValue =
    step < 1
      ? Math.round((value * 100) / multiplier) / 100
      : Math.round(value / multiplier);

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
    units: unitData[type],
    multiplier,
    step,
    displayValue,
  };
};
