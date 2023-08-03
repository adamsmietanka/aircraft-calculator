import InputSlider from "../common/inputs/InputSlider";
import { useEngineStore } from "./stores/useEngine";
import PowerUnitEngineSupercharger from "./PowerUnitEngineSupercharger";
import PowerUnitEngineTurbocharger from "./PowerUnitEngineTurbocharger";
import InputUnits from "../common/inputs/InputUnits";
import useEngineChart from "./hooks/useEngineChart";
import { Canvas } from "@react-three/fiber";
import LineChart from "./three/LineChart";

import { StoreApi, UseBoundStore, create } from "zustand";
import { useEffect } from "react";
import { linearInterpolationArray } from "../../utils/interpolation/binarySearchArray";

export interface ChartStore {
  x: number;
  y: number;
  hover: boolean;
  locked: boolean;
  setY: (value: number) => void;
}

const useChartStore = create<ChartStore>()((set) => ({
  x: 2,
  y: 2,
  hover: false,
  locked: false,
  setY: (value) => set((state) => ({ y: value })),
}));

const useChartCalculations = (
  store: UseBoundStore<StoreApi<ChartStore>>,
  points: number[][]
) => {
  const storeInstance = store();

  useEffect(() => {
    const y = linearInterpolationArray(points, storeInstance.x);
    storeInstance.setY(y);  
    console.log(storeInstance)
  }, [points, storeInstance.x]);
};

const PowerUnitEngine = () => {
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const maxAltitude = useEngineStore((state) => state.maxAltitude);
  const kCoefficient = useEngineStore((state) => state.kCoefficient);
  const setSeaLevelPower = useEngineStore((state) => state.setSeaLevelPower);
  const setMaxAltitude = useEngineStore((state) => state.setMaxAltitude);
  const setKCoefficient = useEngineStore((state) => state.setKCoefficient);

  const points = useEngineChart();

  useChartCalculations(useChartStore, points);

  return (
    <div className="flex p-4 h-full">
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
      <div className="sticky top-1/4 h-3/5 w-3/5">
        <Canvas orthographic camera={{ zoom: 30 }}>
          <LineChart
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
            store={useChartStore}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default PowerUnitEngine;
