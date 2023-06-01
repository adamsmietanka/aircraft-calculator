import React from "react";
import InputNumber from "../common/InputNumber";
import InputSlider from "../../components/atoms/InputSlider";
import { useEngineStore } from "./stores/useEngine";
import PowerUnitEngineChart from "./PowerUnitEngineChart";
import PowerUnitEngineSupercharger from "./PowerUnitEngineSupercharger";
import PowerUnitEngineTurbocharger from "./PowerUnitEngineTurbocharger";

const PowerUnitEngine = () => {
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const maxAltitude = useEngineStore((state) => state.maxAltitude);
  const kCoefficient = useEngineStore((state) => state.kCoefficient);
  const setSeaLevelPower = useEngineStore((state) => state.setSeaLevelPower);
  const setMaxAltitude = useEngineStore((state) => state.setMaxAltitude);
  const setKCoefficient = useEngineStore((state) => state.setKCoefficient);
  return (
    <div className="flex w-full p-4">
      <div className="flex flex-col w-80 mr-8 space-y-1">
        <InputNumber
          value={seaLevelPower}
          setter={setSeaLevelPower}
          step={50}
          label="Sea Level Power"
          unit="kW"
        />
        <InputSlider
          label="Maximum altitude"
          unit="km"
          value={maxAltitude}
          min={5}
          max={15}
          setter={setMaxAltitude}
        />
        <InputSlider
          label="K coefficient"
          unit=""
          value={kCoefficient}
          step={0.01}
          min={0.08}
          max={0.25}
          setter={setKCoefficient}
        />
        <PowerUnitEngineSupercharger />
        <PowerUnitEngineTurbocharger />
      </div>
      <div>
        <PowerUnitEngineChart />
      </div>
    </div>
  );
};

export default PowerUnitEngine;
