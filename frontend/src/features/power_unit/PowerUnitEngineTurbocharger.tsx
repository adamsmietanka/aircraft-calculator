import React from "react";
import InputToggle from "../common/InputToggle";
import InputNumber from "../../components/atoms/InputNumber";
import { useTurbochargerStore } from "./hooks/useTurbocharger";

const PowerUnitEngineTurbocharger = () => {
  const turbocharger = useTurbochargerStore();
  return (
    <>
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
          step={50}
          label="Critical altitude"
          unit="km"
          tooltip="The turbo cannot supply enough air pressure to the cylinders when an aircraft surpasses this altitude"
          disabled={!turbocharger.enabled}
        />
      </div>
    </>
  );
};

export default PowerUnitEngineTurbocharger;
