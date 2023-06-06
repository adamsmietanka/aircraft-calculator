import InputToggle from "../common/inputs/InputToggle";
import { useSuperchargerStore } from "./stores/useSupercharger";
import { useHighGearStartPower } from "./hooks/useHighGearStartPower";
import { useAdditionalHeightPoints } from "./hooks/useAdditionalHeightPoints";
import InputUnits from "../common/inputs/InputUnits";

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
        <InputUnits
          small
          type="altitude"
          value={supercharger.lowGear.endAltitude}
          setter={supercharger.setLGendAltitude}
          label="Critical altitude"
          disabled={!supercharger.enabled}
        />
        <InputUnits
          small
          type="power"
          value={supercharger.lowGear.endPower}
          setter={supercharger.setLGendPower}
          label="Max power"
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
        <InputUnits
          small
          type="altitude"
          value={supercharger.highGear.startAltitude}
          setter={supercharger.setHGstartAltitude}
          label="Gear change altitude"
          disabled={!supercharger.enabled || !supercharger.highGear.enabled}
        />
        <InputUnits
          small
          type="altitude"
          value={supercharger.highGear.endAltitude}
          setter={supercharger.setHGendAltitude}
          label="Critical altitude"
          disabled={!supercharger.enabled || !supercharger.highGear.enabled}
        />
        <InputUnits
          small
          type="power"
          value={supercharger.highGear.endPower}
          setter={supercharger.setHGendPower}
          label="Max power"
          disabled={!supercharger.enabled || !supercharger.highGear.enabled}
        />
      </div>
    </>
  );
};

export default PowerUnitEngineSupercharger;
