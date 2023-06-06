import { useEffect } from "react";
import Calculator from "../common/Calculator";
import { usePropellerStore } from "./stores/usePropeller";
import { usePropeller } from "./hooks/usePropeller";

const PowerUnitPropellerDiameter = () => {
  const diameter = usePropellerStore((state) => state.diameter);
  const manualDiameter = usePropellerStore((state) => state.manualDiameter);
  const optimized = usePropellerStore((state) => state.optimized);
  const setDiameter = usePropellerStore((state) => state.setDiameter);
  const setManualDiameter = usePropellerStore(
    (state) => state.setManualDiameter
  );
  const setOptimized = usePropellerStore((state) => state.setOptimized);

  const { computedDiameter, machTip } = usePropeller();

  useEffect(() => {
    optimized && setDiameter(computedDiameter);
    optimized || setDiameter(manualDiameter);
  }, [computedDiameter, manualDiameter, optimized, setDiameter, setOptimized]);

  return (
    <div className="form-control">
      <label className="label">Propeller Diameter</label>
      <div className="join">
        <Calculator calculated={optimized} setCalculated={setOptimized} />
        <input
          className="input input-bordered w-full join-item"
          type="number"
          min={0}
          step={0.1}
          value={Math.round(diameter * 1000) / 1000}
          onChange={(e) => setManualDiameter(parseFloat(e.target.value))}
          disabled={optimized}
        />
        <div className="flex items-center justify-center bg-base-300 w-16 h-full join-item">
          m
        </div>
      </div>
      {machTip > 0.9 && (
        <p className="label text-xs text-error">
          The propeller tip Mach number is too high! ({machTip})
        </p>
      )}
    </div>
  );
};

export default PowerUnitPropellerDiameter;
