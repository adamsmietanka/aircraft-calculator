import InputNumber from "../common/InputNumber";
import { useEngineStore } from "./stores/useEngine";
import InputDisabled from "../common/InputDisabled";
import { usePropellerStore } from "./stores/usePropeller";
import { usePower } from "./hooks/usePower";
import InputAltitude from "../common/InputAltitude";
import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import { usePropellerInterpolation } from "./hooks/usePropellerInterpolation";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";
import PowerUnitPropellerChart from "./PowerUnitPropellerChart";
import PowerUnitPropellerDiameter from "./PowerUnitPropellerDiameter";
import InputSpeed from "../common/InputSpeed";

const PowerUnitPropeller = () => {
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const cruiseSpeed = usePropellerStore((state) => state.cruiseSpeed);
  const cruiseAltitude = usePropellerStore((state) => state.cruiseAltitude);
  const diameter = usePropellerStore((state) => state.diameter);
  const setEngineSpeed = useEngineStore((state) => state.setEngineSpeed);
  const setReductionRatio = useEngineStore((state) => state.setReductionRatio);
  const setSpeed = usePropellerStore((state) => state.setSpeed);
  const setAltitude = usePropellerStore((state) => state.setAltitude);

  const [interpolateJ] = usePropellerInterpolation();

  const [calculatePower] = usePower();
  const power = calculatePower(cruiseAltitude);
  const density = 1.2255 * (1 - cruiseAltitude / 44.3) ** 4.256;
  const propellerSpeed = (engineSpeed * reductionRatio) / 60;
  const Cn =
    cruiseSpeed * (density / (power * 1000 * propellerSpeed ** 2)) ** 0.2;
  const J = interpolateJ(Cn);
  const computedDiameter = cruiseSpeed / (J * propellerSpeed);
  const soundSpeed = 340.3 * ((288.15 - 6.5 * cruiseAltitude) / 288) ** 0.5;

  const machTip = () => {
    const rotationSpeed = Math.PI * propellerSpeed * diameter;
    const forwardSpeed = 1.2 * cruiseSpeed;
    const a = Math.hypot(forwardSpeed, rotationSpeed) / soundSpeed;
    return parseFloat(a.toFixed(3));
  };

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
          value={Math.round(propellerSpeed * 60 * 100) / 100}
          label="Propeller speed"
          unit="rpm"
        />
        <InputSpeed
          value={cruiseSpeed}
          setter={setSpeed}
          label="Cruise speed"
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
          tooltip="Engine max power at cruise altitude read from the previous tab"
        />
        <InputDisabled
          value={Cn.toPrecision(5)}
          label="Cn"
          tooltip="Diameterless Power Coefficient"
        />
        <PowerUnitPropellerBlades />
        <InputDisabled
          value={J.toPrecision(5)}
          label="J"
          tooltip="Advance ratio is the ratio of the freestream fluid speed to the propeller tip speed"
        />
        <PowerUnitPropellerPitch />
        <PowerUnitPropellerDiameter value={computedDiameter} />
        <InputDisabled value={machTip()} label="Blade Tip Mach number" />
      </div>
      <div>
        <PowerUnitPropellerChart Cn={Cn} J={J} />
      </div>
      <div />
    </div>
  );
};

export default PowerUnitPropeller;
