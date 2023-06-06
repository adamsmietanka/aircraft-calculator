import InputNumber from "../common/inputs/InputNumber";
import { useEngineStore } from "./stores/useEngine";
import InputDisabled from "../common/inputs/InputDisabled";
import { usePropellerStore } from "./stores/usePropeller";
import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";
import PowerUnitPropellerChart from "./PowerUnitPropellerChart";
import PowerUnitPropellerDiameter from "./PowerUnitPropellerDiameter";
import InputUnits from "../common/inputs/InputUnits";
import { usePropeller } from "./hooks/usePropeller";

const PowerUnitPropeller = () => {
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const cruiseSpeed = usePropellerStore((state) => state.cruiseSpeed);
  const cruiseAltitude = usePropellerStore((state) => state.cruiseAltitude);
  const setEngineSpeed = useEngineStore((state) => state.setEngineSpeed);
  const setReductionRatio = useEngineStore((state) => state.setReductionRatio);
  const setSpeed = usePropellerStore((state) => state.setSpeed);
  const setAltitude = usePropellerStore((state) => state.setAltitude);

  const { power, propellerSpeed, Cn, J, machTip } =
    usePropeller();

  return (
    <div className="flex w-full p-4">
      <div className="flex flex-col w-80 mr-8 space-y-1">
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
        <InputDisabled
          value={propellerSpeed}
          label="Propeller speed"
          unit="rpm"
        />
        <InputUnits
          type="speed"
          value={cruiseSpeed}
          setter={setSpeed}
          label="Cruise speed"
          tooltip="The speed of most economical flight"
        />
        <InputUnits
          type="altitude"
          label="Cruise altitude"
          value={cruiseAltitude}
          setter={setAltitude}
        />
        <InputDisabled
          value={Math.round(power * 100) / 100}
          label="Power"
          unit="kW"
          tooltip="Engine max power at cruise altitude read from the previous tab"
        />
        <InputDisabled
          value={Cn}
          label="Cn"
          tooltip="Diameterless Power Coefficient"
        />
        <PowerUnitPropellerBlades />
        <InputDisabled
          value={J}
          label="J"
          tooltip="Advance ratio is the ratio of the freestream fluid speed to the propeller tip speed"
        />
        <PowerUnitPropellerPitch />
        <PowerUnitPropellerDiameter />
        <InputDisabled value={machTip} label="Blade Tip Mach number" />
      </div>
      <div>
        <PowerUnitPropellerChart Cn={Cn} J={J} />
      </div>
      <div />
    </div>
  );
};

export default PowerUnitPropeller;
