import InputSlider from "../common/inputs/InputSlider";
import { useEngineStore } from "./stores/useEngine";
import PowerUnitEngineChart from "./PowerUnitEngineChart";
import PowerUnitEngineSupercharger from "./PowerUnitEngineSupercharger";
import PowerUnitEngineTurbocharger from "./PowerUnitEngineTurbocharger";
import InputUnits from "../common/inputs/InputUnits";
import Chart2D from "./three/Chart2D";
import useEngineChart from "./hooks/useEngineChart";

const PowerUnitEngine = () => {
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const maxAltitude = useEngineStore((state) => state.maxAltitude);
  const kCoefficient = useEngineStore((state) => state.kCoefficient);
  const setSeaLevelPower = useEngineStore((state) => state.setSeaLevelPower);
  const setMaxAltitude = useEngineStore((state) => state.setMaxAltitude);
  const setKCoefficient = useEngineStore((state) => state.setKCoefficient);

  const points = useEngineChart();

  return (
    <div className="flex w-full p-4">
      <div className="flex flex-col w-80 mr-8 space-y-1">
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
      <div>
        <PowerUnitEngineChart />
        <Chart2D trace={points}/>
      </div>
    </div>
  );
};

export default PowerUnitEngine;
