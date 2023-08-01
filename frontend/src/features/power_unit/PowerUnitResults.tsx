import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";
import PowerUnitResults3D from "./three/PowerUnitResults3D";

import { usePowerUnitResults } from "./hooks/usePowerUnitResults";
import { useResultsStore } from "./stores/useResults";
import InputUnits from "../common/inputs/InputUnits";
import PowerUnitPropellerDiameter from "./PowerUnitPropellerDiameter";
import InputNumber from "../common/inputs/InputNumber";
import { Canvas } from "@react-three/fiber";
import LineChart from "./three/LineChart";
import { usePropellerStore } from "./stores/usePropeller";

const PowerUnitResults = () => {
  const altitude = useResultsStore((state) => state.altitude);
  const speed = usePropellerStore((state) => state.cruiseSpeed);
  const setAltitude = useResultsStore((state) => state.setAltitude);
  const [power, Cp] = usePowerUnitResults();

  const table = useResultsStore((state) => state.table);
  const tracesPower = [
    {
      name: "power",
      points: table.map(({ v, prop_power }) => [v, prop_power, 0]),
    },
  ];
  const tracesAngle = [
    {
      name: "angle",
      points: table.map(({ v, angle }) => [v, angle, 0]),
    },
  ];
  const tracesRPM = [
    {
      name: "RPM",
      points: table.map(({ v, rpm }) => [v, rpm, 0]),
    },
  ];
  const tracesCp = [
    {
      name: "Cp",
      points: table.map(({ v, cp }) => [v, cp, 0]),
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
        <div className="grid grid-cols-2 gap-4 h-1/2">
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              traces={tracesPower}
              xAxis={{ name: "Speed", type: "speed", max: 1.2 * speed }}
              yAxis={{
                name: "Power",
                type: "power",
              }}
            />
          </Canvas>
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              traces={tracesAngle}
              xAxis={{ name: "Speed", type: "speed", max: 1.2 * speed }}
              yAxis={{
                name: "Angle",
                min: 0,
              }}
            />
          </Canvas>
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              traces={tracesRPM}
              xAxis={{ name: "Speed", type: "speed", max: 1.2 * speed }}
              yAxis={{
                name: "RPM",
                min: 0,
              }}
            />
          </Canvas>
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              traces={tracesCp}
              xAxis={{ name: "Speed", type: "speed", max: 1.2 * speed }}
              yAxis={{
                name: "Cp",
                min: 0,
              }}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default PowerUnitResults;
