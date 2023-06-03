import React from "react";
import InputToggle from "../common/inputs/InputToggle";
import InputNumber from "../common/inputs/InputNumber";
import { useTurbochargerStore } from "./stores/useTurbocharger";

const PowerUnitEngineTurbocharger = () => {
  const turbocharger = useTurbochargerStore();
  return (
    <div className="my-2">
      <InputToggle
        label="Turbocharger"
        value={turbocharger.enabled}
        tooltip="A mechanical compressor using the energy of exhaust gasses to force more air into the cylinders"
        setter={turbocharger.setEnabled}
      />
      <div className="rounded-2xl shadow p-4">
        <InputNumber
          value={turbocharger.endAltitude}
          setter={turbocharger.setEndAltitude}
          step={0.1}
          label="Critical altitude"
          unit="km"
          tooltip="The turbo cannot supply enough air pressure to the cylinders when an aircraft surpasses this altitude"
          disabled={!turbocharger.enabled}
        />
      </div>
    </div>
  );
};

export default PowerUnitEngineTurbocharger;
