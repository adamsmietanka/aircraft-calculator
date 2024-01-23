import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";
import PowerUnitResults3D from "./three/PowerUnitResults3D";

import { usePowerUnitResults } from "./hooks/usePowerUnitResults";
import { useResultsStore } from "./stores/useResults";
import InputUnits from "../common/inputs/InputUnits";
import PowerUnitPropellerDiameter from "./PowerUnitPropellerDiameter";
import InputNumber from "../common/inputs/InputNumber";
import { Canvas } from "@react-three/fiber";
import LineChart from "../common/three/LineChart";
import { usePropellerStore } from "./stores/usePropeller";
import useResultsChart from "./hooks/useResultsChart";

const PowerUnitResults = () => {
  const altitude = useResultsStore((state) => state.altitude);
  const speed = usePropellerStore((state) => state.cruiseSpeed);
  const setAltitude = useResultsStore((state) => state.setAltitude);
  const [power, Cp] = usePowerUnitResults();

  const {
    tracesPower,
    tracesAngle,
    tracesRPM,
    tracesCp,
    useResultsChartStore,
  } = useResultsChart();

  return (
    <div className="flex w-full h-full p-6">
      <div className="flex flex-col w-80 mr-8 space-y-2 z-50">
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
        <div className="fixed top-0 left-0 h-screen w-screen">
          <Canvas flat camera={{ position: [0, 0, 20], fov: 60 }}>
            <LineChart
              gridPositionX={-0.5}
              width={0.5}
              height={0.3}
              name="Propeller Power"
              traces={tracesPower}
              axes={{
                x: { name: "Speed", type: "speed", max: 1.2 * speed },
                y: {
                  name: "Power",
                  type: "power",
                },
              }}
              store={useResultsChartStore}
            />
            <LineChart
              gridPositionX={0.5}
              width={0.5}
              height={0.3}
              name="Propeller Angle"
              traces={tracesAngle}
              axes={{
                x: { name: "Speed", type: "speed", max: 1.2 * speed },
                y: {
                  name: "Angle",
                  min: 0,
                },
              }}
              store={useResultsChartStore}
            />
            <mesh position-y={-6}>
              <LineChart
                gridPositionX={-0.5}
                width={0.5}
                height={0.3}
                name="Propeller Speed"
                traces={tracesRPM}
                axes={{
                  x: { name: "Speed", type: "speed", max: 1.2 * speed },
                  y: {
                    name: "RPM",
                    min: 0,
                  },
                }}
                store={useResultsChartStore}
              />
              <LineChart
                gridPositionX={0.5}
                width={0.5}
                height={0.3}
                name="Coefficient of Power"
                traces={tracesCp}
                axes={{
                  x: { name: "Speed", type: "speed", max: 1.2 * speed },
                  y: {
                    name: "Cp",
                    min: 0,
                  },
                }}
                store={useResultsChartStore}
              />
            </mesh>
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default PowerUnitResults;
