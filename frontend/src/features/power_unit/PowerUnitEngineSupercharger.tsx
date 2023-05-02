import React from "react";
import InputNumber from "../../components/atoms/InputNumber";
import InputToggle from "../common/InputToggle";
import { useSuperchargerStore } from "./hooks/useSupercharger";

const PowerUnitEngineSupercharger = () => {
  const supercharger = useSuperchargerStore();
  return (
    <>
      <InputToggle
        label="Supercharger"
        value={supercharger.enabled}
        tooltip="A mechanical compressor using engine power through a set of pulleys to force more air into the cylinders"
        setter={supercharger.setEnabled}
      />
      <div className="rounded-2xl shadow p-4">
        <InputNumber
          value={supercharger.LGendAltitude}
          setter={supercharger.setLGendAltitude}
          step={0.1}
          label="Critical altitude"
          unit="km"
          disabled={!supercharger.enabled}
        />
        <InputNumber
          value={supercharger.LGendPower}
          setter={supercharger.setLGendPower}
          step={50}
          label="Max power"
          unit="kW"
          disabled={!supercharger.enabled}
        />
        <div className="divider"></div> 
        <InputToggle
          label="High Gear"
          value={supercharger.HGenabled}
          tooltip="Adding a gearbox allows for tuning the compressor speed and in turn the amount of air that reaches the combustion chambers"
          disabled={!supercharger.enabled}
          setter={supercharger.setHGEnabled}
        />
        <InputNumber
          value={supercharger.HGstartAltitude}
          setter={supercharger.setHGstartAltitude}
          step={50}
          label="Gear change altitude"
          unit="km"
          disabled={!supercharger.enabled || !supercharger.HGenabled}
        />
        <InputNumber
          value={supercharger.HGendAltitude}
          setter={supercharger.setHGendAltitude}
          step={50}
          label="Critical altitude"
          unit="km"
          disabled={!supercharger.enabled || !supercharger.HGenabled}
        />
        <InputNumber
          value={supercharger.HGendPower}
          setter={supercharger.setHGendPower}
          step={50}
          label="Max power"
          unit="kW"
          disabled={!supercharger.enabled || !supercharger.HGenabled}
        />
      </div>
    </>
  );
};

export default PowerUnitEngineSupercharger;
