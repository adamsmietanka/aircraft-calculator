import { useEffect, useState } from "react";
import { useGlobalUnitsStore } from "../stores/useGlobalUnits";
import { unitData } from "../data/units";

export const useUnits = (type: string) => {
  const types = useGlobalUnitsStore((state) => state.types);
  const system = useGlobalUnitsStore((state) => state.system);
  const setSpeed = useGlobalUnitsStore((state) => state.setSpeed);
  const setAltitude = useGlobalUnitsStore((state) => state.setAltitude);

  const [unit, setUnit] = useState(types[type]);

  useEffect(() => {
    setUnit(() => types[type]);
  }, [types, type, setUnit]);

  useEffect(() => {
    setSpeed(system === "metric" ? "m/s" : "mph");
    setAltitude(system === "metric" ? "km" : "ft");
  }, [system, type, setSpeed, setAltitude]);

  return { unit, setUnit, units: unitData[type] };
};
