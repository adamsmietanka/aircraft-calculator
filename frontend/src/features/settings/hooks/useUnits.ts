import { useEffect, useState } from "react";
import { useGlobalUnitsStore } from "../stores/useGlobalUnits";
import { unitDisplay, unitMultipliers } from "../data/units";
import { getStep } from "../../common/three/hooks/useAxes";
import round from "../../../utils/interpolation/round";

export const useUnits = (value: number, type: string) => {
  const types = useGlobalUnitsStore((state) => state.types);
  const system = useGlobalUnitsStore((state) => state.system);
  const setAltitude = useGlobalUnitsStore((state) => state.setAltitude);
  const setLength = useGlobalUnitsStore((state) => state.setLength);
  const setArea = useGlobalUnitsStore((state) => state.setArea);
  const setSpeed = useGlobalUnitsStore((state) => state.setSpeed);
  const setPower = useGlobalUnitsStore((state) => state.setPower);

  const [unit, setUnit] = useState(types[type]);

  const multiplier = unitMultipliers[type][unit];
  const step = Math.pow(10, Math.floor(Math.log10(value / multiplier) - 0.6985) - 1);

  const displayValue = round(value / multiplier, step / 10);

  useEffect(() => {
    setUnit(() => types[type]);
  }, [types, type, setUnit]);

  useEffect(() => {
    setAltitude(system === "metric" ? "km" : "ft");
    setLength(system === "metric" ? "m" : "ft");
    setArea(system === "metric" ? "m2" : "ft2");
    setSpeed(system === "metric" ? "m/s" : "mph");
    setPower(system === "metric" ? "kW" : "hp");
  }, [system, setSpeed, setAltitude]);

  return {
    unit: unitDisplay[type][unit],
    setUnit,
    units: unitDisplay[type],
    multiplier,
    step,
    displayValue,
  };
};
