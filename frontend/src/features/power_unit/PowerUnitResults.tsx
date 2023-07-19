import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";
import PowerUnitResults3D from "./three/PowerUnitResults3D";
import PowerUnitResultsPowerChart from "./PowerUnitResultsPowerChart";

import { usePowerUnitResults } from "./hooks/usePowerUnitResults";
import { useResultsStore } from "./stores/useResults";
import InputUnits from "../common/inputs/InputUnits";
import PowerUnitPropellerDiameter from "./PowerUnitPropellerDiameter";
import InputNumber from "../common/inputs/InputNumber";
import { Canvas } from "@react-three/fiber";
import LineChart from "./three/LineChart";

const PowerUnitResults = () => {
  const altitude = useResultsStore((state) => state.altitude);
  const setAltitude = useResultsStore((state) => state.setAltitude);
  const [power, Cp] = usePowerUnitResults();

  const table = useResultsStore((state) => state.table);
  const traces = [
    {
      name: "power",
      points: table.map(({ v, prop_power }) => [v, prop_power, 0]),
    },
  ];

  return (
    <div className="flex w-full h-full p-4">
      <div className="flex flex-col w-80 mr-8 space-y-2">
        <InputUnits
          type="altitude"
          value={altitude}
          setter={setAltitude}
          label="Altitude"
        />
        <InputUnits
          disabled
          type="power"
          value={Math.round(power * 100) / 100}
          label="Power"
          tooltip="Engine max power read from the Engine tab"
        />
        <InputNumber
          disabled
          value={Math.round(Cp * 10000) / 10000}
          label="Cp"
          tooltip="Coefficient of Power - this is usually stated as the amount of power the propeller absorbs"
        />
        <PowerUnitPropellerBlades />
        <PowerUnitPropellerPitch />
        <PowerUnitPropellerDiameter />
      </div>
      <div className="flex flex-col space-y-4 w-3/5">
        <PowerUnitResults3D />
        <div className="h-2/5">
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              traces={traces}
              xAxis={{ name: "Speed", type: "speed" }}
              yAxis={{
                name: "Power",
                type: "power",
              }}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default PowerUnitResults;
