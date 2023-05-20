import InfoTooltip from "../common/InfoTooltip";
import { useEffect } from "react";
import Padlock from "../common/Padlock";
import { usePropellerStore } from "./stores/usePropeller";

interface Props {
  value: number;
  tooltip?: string;
}

const PowerUnitPropellerDiameter = ({ value, tooltip }: Props) => {
  const diameter = usePropellerStore((state) => state.diameter);
  const optimized = usePropellerStore((state) => state.optimized);
  const setDiameter = usePropellerStore((state) => state.setDiameter);
  const setOptimized = usePropellerStore((state) => state.setOptimized);

  useEffect(() => {
    optimized && setDiameter(parseFloat(value.toPrecision(3)));
  }, [value, optimized, setDiameter, setOptimized]);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex ">
          {"Propeller Diameter"}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
      </label>
      <label className="input-group">
        <Padlock locked={optimized} setLocked={setOptimized} />
        <input
          className="input input-bordered w-full"
          type="number"
          min={0}
          step={0.1}
          value={diameter}
          onChange={(e) => setDiameter(parseFloat(e.target.value))}
          disabled={optimized}
        />
        <span className="flex items-center justify-center w-20 rounded-lg h-12">
          m
        </span>
      </label>
    </div>
  );
};

export default PowerUnitPropellerDiameter;
