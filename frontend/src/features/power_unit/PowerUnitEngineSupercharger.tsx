import InputNumberSmall from "../common/InputNumberSmall";
import InputToggle from "../common/InputToggle";
import { useSuperchargerStore } from "./stores/useSupercharger";
import { useHighGearStartPower } from "./hooks/useHighGearStartPower";
import { useAdditionalHeightPoints } from "./hooks/useAdditionalHeightPoints";

const PowerUnitEngineSupercharger = () => {
  const supercharger = useSuperchargerStore();
  useHighGearStartPower();
  useAdditionalHeightPoints();
  return (
    <>
      <InputToggle
        label="Supercharger"
        value={supercharger.enabled}
        tooltip="A mechanical compressor using engine power through a set of pulleys to force more air into the cylinders"
        setter={supercharger.setEnabled}
      />
      <div className="rounded-2xl shadow p-4">
        <InputNumberSmall
          value={supercharger.lowGear.endAltitude}
          setter={supercharger.setLGendAltitude}
          step={0.1}
          label="Critical altitude"
          unit="km"
          disabled={!supercharger.enabled}
        />
        <InputNumberSmall
          value={supercharger.lowGear.endPower}
          setter={supercharger.setLGendPower}
          step={50}
          label="Max power"
          unit="kW"
          disabled={!supercharger.enabled}
        />
        <div className="divider"></div>
        <InputToggle
          label="High Gear"
          value={supercharger.highGear.enabled}
          tooltip="Adding a gearbox allows for tuning the compressor speed and in turn the amount of air that reaches the combustion chambers"
          disabled={!supercharger.enabled}
          setter={supercharger.setHGEnabled}
        />
        <InputNumberSmall
          value={supercharger.highGear.startAltitude}
          setter={supercharger.setHGstartAltitude}
          step={0.1}
          label="Gear change altitude"
          unit="km"
          disabled={!supercharger.enabled || !supercharger.highGear.enabled}
        />
        <InputNumberSmall
          value={supercharger.highGear.endAltitude}
          setter={supercharger.setHGendAltitude}
          step={0.1}
          label="Critical altitude"
          unit="km"
          disabled={!supercharger.enabled || !supercharger.highGear.enabled}
        />
        <InputNumberSmall
          value={supercharger.highGear.endPower}
          setter={supercharger.setHGendPower}
          step={50}
          label="Max power"
          unit="kW"
          disabled={!supercharger.enabled || !supercharger.highGear.enabled}
        />
      </div>
    </>
  );
};

export default PowerUnitEngineSupercharger;
