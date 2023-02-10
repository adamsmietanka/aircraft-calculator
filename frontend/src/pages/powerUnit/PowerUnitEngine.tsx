import React from "react";
import InputNumber from "../../components/atoms/InputNumber";
import { useEngineStore } from "../../data/stores/useEngine";
import PowerUnitEngineChart from "./PowerUnitEngineChart";

const PowerUnitEngine = () => {
    const seaLevelPower = useEngineStore((state) => state.seaLevelPower)
    const engineSpeed = useEngineStore((state) => state.engineSpeed)
    const reductionRatio = useEngineStore((state) => state.reductionRatio)
    const setSeaLevelPower = useEngineStore((state) => state.setSeaLevelPower)
    const setEngineSpeed = useEngineStore((state) => state.setEngineSpeed)
    const setReductionRatio = useEngineStore((state) => state.setReductionRatio)
  return (
    <div className="flex">
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <InputNumber
          value={seaLevelPower}
          setter={setSeaLevelPower}
          label="Sea Level Power"
          unit="kW"
        />
        <InputNumber
          value={engineSpeed}
          setter={setEngineSpeed}
          label="Engine Speed"
          unit="rpm"
        />
        <InputNumber
          value={reductionRatio}
          setter={setReductionRatio}
          label="Reduction Ratio"
          unit=":1"
        />
      </div>
      <PowerUnitEngineChart />
    </div>
  );
};

export default PowerUnitEngine;