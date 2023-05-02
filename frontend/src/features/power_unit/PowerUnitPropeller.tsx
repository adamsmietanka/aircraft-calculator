import React from "react";
import InputNumber from "../../components/atoms/InputNumber";
import { useEngineStore } from "./hooks/useEngine";

const PowerUnitPropeller = () => {
  const engineSpeed = useEngineStore((state) => state.engineSpeed)
  const reductionRatio = useEngineStore((state) => state.reductionRatio)
  const setEngineSpeed = useEngineStore((state) => state.setEngineSpeed)
  const setReductionRatio = useEngineStore((state) => state.setReductionRatio)
  return (
    <div className="flex">
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <InputNumber
          value={engineSpeed}
          setter={setEngineSpeed}
          step={50}
          label="Engine Speed"
          unit="rpm"
        />
        <InputNumber
          value={reductionRatio}
          setter={setReductionRatio}
          step={0.05}
          label="Reduction Ratio"
          unit=":1"
        />
      </div>
      <div />
    </div>
  );
};

export default PowerUnitPropeller;
