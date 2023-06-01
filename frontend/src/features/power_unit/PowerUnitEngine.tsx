import React from "react";

import InputNumber from "../common/InputNumber";
import InputSlider from "../common/InputSlider";
import { useEngineStore } from "../../data/stores/useEngine";
import PowerUnitEngineChart from "./PowerUnitEngineChart";

const PowerUnitEngine = () => {
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const maxAltitude = useEngineStore((state) => state.maxAltitude);
  const setSeaLevelPower = useEngineStore((state) => state.setSeaLevelPower);
  const setEngineSpeed = useEngineStore((state) => state.setEngineSpeed);
  const setReductionRatio = useEngineStore((state) => state.setReductionRatio);
  const setMaxAltitude = useEngineStore((state) => state.setMaxAltitude);
  return (
    <div className="flex">
      <div className="flex flex-col w-64 mr-8 space-y-2">
        <InputNumber
          value={seaLevelPower}
          setter={setSeaLevelPower}
          step={50}
          label="Sea Level Power"
          unit="kW"
        />
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
        <InputSlider
          label="Maximum altitude"
          unit="km"
          value={maxAltitude}
          max={15}
          setter={setMaxAltitude}
        />
      </div>
      <PowerUnitEngineChart />
    </div>
  );
};

export default PowerUnitEngine;
