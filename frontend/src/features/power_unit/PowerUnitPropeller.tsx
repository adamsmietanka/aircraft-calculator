import InputNumber from "../common/InputNumber";
import { useEngineStore } from "./hooks/useEngine";
import InputDisabled from "../common/InputDisabled";
import { usePropellerStore } from "./stores/usePropeller";
import { usePower } from "./hooks/usePower";
import InputAltitude from "../common/InputAltitude";

const PowerUnitPropeller = () => {
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const cruiseSpeed = usePropellerStore((state) => state.cruiseSpeed);
  const cruiseAltitude = usePropellerStore((state) => state.cruiseAltitude);
  const setEngineSpeed = useEngineStore((state) => state.setEngineSpeed);
  const setReductionRatio = useEngineStore((state) => state.setReductionRatio);
  const setSpeed = usePropellerStore((state) => state.setSpeed);
  const setAltitude = usePropellerStore((state) => state.setAltitude);

  const [calculatePower] = usePower();
  const power = calculatePower(cruiseAltitude);
  const density = 1.2255 * (1 - cruiseAltitude / 44.3) ** 4.256;
  const propellerSpeed = engineSpeed * reductionRatio;
  const Cn =
    cruiseSpeed *
    (density / (power * 1000 * (propellerSpeed / 60) ** 2)) ** 0.2;
  return (
    <div className="flex">
      <div className="flex flex-col w-64 mr-8 space-y-2">
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
          value={Math.round(propellerSpeed * 100) / 100}
          label="Propeller speed"
          unit="rpm"
        />
        <InputNumber
          value={cruiseSpeed}
          setter={setSpeed}
          label="Cruise speed"
          unit="m/s"
          tooltip="The speed of most economical flight"
        />
        <InputAltitude
          label="Cruise altitude"
          value={cruiseAltitude}
          setter={setAltitude}
        />
        <InputDisabled
          value={Math.round(power * 100) / 100}
          label="Power"
          unit="kW"
          tooltip="Engine max power at cruise altitude"
        />
        <InputDisabled
          value={Cn.toPrecision(5)}
          label="Cn"
          unit=""
          tooltip="Engine max power at cruise altitude"
        />
      </div>
      <div />
    </div>
  );
};

export default PowerUnitPropeller;
