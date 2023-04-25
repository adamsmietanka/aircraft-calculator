import React, { useCallback, useEffect, useState } from "react";
import { useEngineStore } from "./useEngine";
import { usePower } from "./usePower";

const PowerUnitEngineChart = () => {
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const heights = useEngineStore((state) => state.heights);
  const [calculatePower] = usePower();
  const [number, setNumber] = useState(0);

  useEffect(() => {
    console.log(heights.map(calculatePower));
  }, [calculatePower, heights]);
  return (
    <div className="bg-red-200 w-full text-bold text-black text-3xl flex flex-col justify-center items-center">
      <div>Chart goes here</div>
      <div>SL Power: {seaLevelPower}</div>
      <div>Engine speed: {engineSpeed}</div>
      <button onClick={() => setNumber((i) => i + 1)}>{number}</button>
    </div>
  );
};

export default PowerUnitEngineChart;
