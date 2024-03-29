import InputNumber from "../common/inputs/InputNumber";
import { useEngineStore } from "./stores/useEngine";
import { usePropellerStore } from "./stores/usePropeller";
import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";
import PowerUnitPropellerDiameter from "./PowerUnitPropellerDiameter";
import InputUnits from "../common/inputs/InputUnits";
import { usePropeller } from "./hooks/usePropeller";
import usePropellerChart from "./hooks/usePropellerChart";
import { Canvas } from "@react-three/fiber";
import LineChart from "../common/three/LineChart";

const PowerUnitPropeller = () => {
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const cruiseSpeed = usePropellerStore((state) => state.cruiseSpeed);
  const cruiseAltitude = usePropellerStore((state) => state.cruiseAltitude);
  const setEngineSpeed = useEngineStore((state) => state.setEngineSpeed);
  const setReductionRatio = useEngineStore((state) => state.setReductionRatio);
  const setSpeed = usePropellerStore((state) => state.setSpeed);
  const setAltitude = usePropellerStore((state) => state.setAltitude);

  const { power, propellerSpeed, Cn, J, machTip } = usePropeller();

  const { traces, usePropellerChartStore } = usePropellerChart({ x: Cn, y: J });

  return (
    <div className="flex w-full p-6 h-full">
      <div className="flex flex-col w-80 mr-8 space-y-1 z-50">
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
        <InputNumber
          disabled
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
        <InputUnits
          type="power"
          value={Math.round(power * 100) / 100}
          label="Power"
          tooltip="Engine max power at cruise altitude read from the previous tab"
        />
        <InputNumber
          disabled
          value={Cn}
          label="Cn"
          tooltip="Diameterless Power Coefficient"
        />
        <PowerUnitPropellerBlades />
        <InputNumber
          disabled
          value={J}
          label="J"
          tooltip="Advance ratio is the ratio of the freestream fluid speed to the propeller tip speed"
        />
        <PowerUnitPropellerPitch />
        <PowerUnitPropellerDiameter />
        <InputNumber disabled value={machTip} label="Blade Tip Mach number" />
      </div>
      <div className="fixed top-0 left-0 h-screen w-screen">
        <Canvas flat camera={{position: [0, 0, 20], fov: 60 }}>
          <LineChart
            name=""
            width={1}
            traces={traces}
            axes={{
              x: { name: "Cn" },
              y: {
                name: "J",
              },
            }}
            store={usePropellerChartStore}
            point={{ x: Cn, y: J }}
          />
        </Canvas>
      </div>
      <div />
    </div>
  );
};

export default PowerUnitPropeller;
