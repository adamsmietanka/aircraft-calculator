import InputSlider from "../common/inputs/InputSlider";
import { useEngineStore } from "./stores/useEngine";
import PowerUnitEngineSupercharger from "./PowerUnitEngineSupercharger";
import PowerUnitEngineTurbocharger from "./PowerUnitEngineTurbocharger";
import InputUnits from "../common/inputs/InputUnits";
import useEngineChart from "./hooks/useEngineChart";
import { Canvas } from "@react-three/fiber";
import LineChart from "./three/LineChart";

import { StoreApi, UseBoundStore, create } from "zustand";
import { useCallback, useEffect, useMemo } from "react";
import {
  // findUpperBound,
  linearInterpolation,
} from "../../utils/interpolation/binarySearch";

export interface ChartStore {
  x: number;
  y: number;
  hover: boolean;
  setY: (value: number) => void;
}

const useChartStore = create<ChartStore>()((set) => ({
    x: 2,
    y: 2,
    hover: false,
    setY: (value) => set((state) => ({ y: value })),
}));

const findUpperBoundArray = (
  arr: number[][],
  target: number,
  axis = 0
): number => {
  let low = 0;
  let high = arr.length - 1;
  let upperBound = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid][axis] >= target) {
      high = mid - 1; // Target is in the left half of the array
      upperBound = mid; // Update the lower bound
    } else {
      low = mid + 1;
    }
  }

  return upperBound;
};

const linearInterpolationArray = (points: number[][], x: number): number => {
  const index = findUpperBoundArray(points, x);
  const [x0, y0] = points[index - 1];
  const [x1, y1] = points[index];

  if (x0 === x1 || x1 === undefined) {
    return y0; // Avoid division by zero
  }

  const y = y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  return y;
};

const useChartCalculations = (
  store: UseBoundStore<StoreApi<ChartStore>>,
  points: number[][]
) => {
  const storeInstance = store();

  useEffect(() => {
    const y = linearInterpolationArray(points, storeInstance.x);
    // console.log(y);
    storeInstance.setY(y);
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
          {/* <gridHelper rotation-x={Math.PI / 2} /> */}
          <LineChart
            traces={[{ name: "Power", points }]}
            xAxis={{ name: "Altitude", type: "altitude", max: maxAltitude }}
            yAxis={{
              name: "Power",
              type: "power",
              min: 0,
              max: seaLevelPower * 1.4,
            }}
            store={useChartStore}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default PowerUnitEngine;
