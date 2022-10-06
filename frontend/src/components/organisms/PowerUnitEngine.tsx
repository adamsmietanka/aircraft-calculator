import React from "react";
import InputNumber from "../atoms/InputNumber";

const PowerUnitEngine = () => {
  return (
    <div className="flex">
      <div className="flex flex-col w-64 mr-8">
        <InputNumber
          value={1000}
          setter={(value) => {}}
          label="Sea Level Power"
          unit="kW"
        />
        <InputNumber
          value={3000}
          setter={(value) => {}}
          label="Engine Speed"
          unit="rpm"
        />
        <InputNumber
          value={0.4}
          setter={(value) => {}}
          label="Reduction Ratio"
          unit=":1"
        />
      </div>
      <div className="bg-red-200 w-full text-bold text-black text-3xl flex justify-center items-center">Chart goes here</div>
    </div>
  );
};

export default PowerUnitEngine;
