import InfoTooltip from "../common/InfoTooltip";
import { useEffect } from "react";
import Calculator from "../common/Calculator";
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
    optimized && setDiameter(parseFloat(value.toPrecision(4)));
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
        <Calculator calculated={optimized} setCalculated={setOptimized} />
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
