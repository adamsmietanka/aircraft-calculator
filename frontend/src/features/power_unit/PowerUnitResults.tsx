import React from "react";
import InputAltitude from "../common/inputs/InputAltitude";
import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";
import InputDisabled from "../common/inputs/InputDisabled";
import PowerUnitResults3D from "./three/PowerUnitResults3D";
import PowerUnitResultsPowerChart from "./PowerUnitResultsPowerChart";

import { usePowerUnitResults } from "./stores/usePowerUnitResults";
import { useResultsStore } from "./stores/useResults";

const PowerUnitResults = () => {
  const altitude = useResultsStore((state) => state.altitude);
  const setAltitude = useResultsStore((state) => state.setAltitude);
  const [power, Cp] = usePowerUnitResults();

  return (
    <div className="flex w-full h-full p-4">
      <div className="flex flex-col w-80 mr-8 space-y-2">
        <InputAltitude value={altitude} setter={setAltitude} label="Altitude" />
        <InputDisabled
          value={Math.round(power * 100) / 100}
          label="Power"
          unit="kW"
          tooltip="Engine max power read from the Engine tab"
        />
        <InputDisabled
          value={Math.round(Cp * 10000) / 10000}
          label="Cp"
          unit="kW"
          tooltip="Coefficient of Power - this is usually stated as the amount of power the propeller absorbs"
        />
        <PowerUnitPropellerBlades />
        <PowerUnitPropellerPitch />
      </div>
      <div className="flex flex-col space-y-4">
        <PowerUnitResults3D />
        <PowerUnitResultsPowerChart />
      </div>
    </div>
  );
};

export default PowerUnitResults;
