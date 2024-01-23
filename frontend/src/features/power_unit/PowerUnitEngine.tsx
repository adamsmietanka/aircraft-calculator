import InputSlider from "../common/inputs/InputSlider";
import { useEngineStore } from "./stores/useEngine";
import PowerUnitEngineSupercharger from "./PowerUnitEngineSupercharger";
import PowerUnitEngineTurbocharger from "./PowerUnitEngineTurbocharger";
import InputUnits from "../common/inputs/InputUnits";
import useEngineChart, { useEngineChartStore } from "./hooks/useEngineChart";
import { Canvas } from "@react-three/fiber";
import LineChart from "../common/three/LineChart";

const PowerUnitEngine = () => {
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const maxAltitude = useEngineStore((state) => state.maxAltitude);
  const kCoefficient = useEngineStore((state) => state.kCoefficient);
  const setSeaLevelPower = useEngineStore((state) => state.setSeaLevelPower);
  const setMaxAltitude = useEngineStore((state) => state.setMaxAltitude);
  const setKCoefficient = useEngineStore((state) => state.setKCoefficient);

  const { points } = useEngineChart();

  return (
    <div className="flex p-6 h-full">
      <div className="flex flex-col w-80 mr-8 space-y-1 z-50">
        <InputUnits
          type="power"
          value={seaLevelPower}
          setter={setSeaLevelPower}
          label="Sea Level Power"
        />
        <InputSlider
          label="Maximum altitude"
          unit="km"
          value={maxAltitude}
          min={5}
          max={15}
          setter={setMaxAltitude}
        />
        <InputSlider
          label="K coefficient"
          unit=""
          value={kCoefficient}
          step={0.01}
          min={0.08}
          max={0.25}
          setter={setKCoefficient}
        />
        <PowerUnitEngineSupercharger />
        <PowerUnitEngineTurbocharger />
      </div>
      <div className="fixed top-0 left-0 h-screen w-screen">
        <Canvas flat camera={{position: [0, 0, 20], fov: 60 }}>
          <LineChart
            width={1}
            name="Engine Altitude Performance"
            traces={[{ name: "Power", points }]}
            axes={{
              x: { name: "Altitude", type: "altitude", max: maxAltitude },
              y: {
                name: "Power",
                type: "power",
                min: 0,
                max: seaLevelPower * 1.4,
              },
            }}
            store={useEngineChartStore}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default PowerUnitEngine;
