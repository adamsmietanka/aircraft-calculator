import React from "react";
import { useEngineStore } from "../../utils/useEngine";

const PowerUnitEngineChart = () => {
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  return (
    <div className="bg-red-200 w-full text-bold text-black text-3xl flex flex-col justify-center items-center">
      <div>Chart goes here</div>
      <div>SL Power: {seaLevelPower}</div>
      <div>Engine speed: {engineSpeed}</div>
      <div>Reduction ratio: {reductionRatio}</div>
    </div>
  );
};

export default PowerUnitEngineChart;
