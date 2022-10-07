import React, { useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import { useEngineStore } from "../../utils/useEngine";
import { density } from "../../utils/atmosphere";

interface powerInput {
  seaLevelPower: number;
  engineSpeed: number;
  reductionRatio: number;
  maxAltitude: number;
  kCoefficient: number;
  halfSupercharger?: { endAltitue: number; endPower: number };
  endSupercharger?: { endAltitue: number; endPower: number };
}

const powerFunction = (props: powerInput) => {
  let heights = Array.from(
    { length: Math.floor(props.maxAltitude / 100) },
    (_, i) => 100 * i
  );
  heights = [...heights, props.maxAltitude];
  console.log(heights);
  let power = Array.from(
    heights,
    (height) =>
      (props.seaLevelPower *
        (density(height) / density(0) - props.kCoefficient)) /
      (1 - props.kCoefficient)
  );
  return { x: heights, y: power };
};

let layout = {
  title: {
    text: "Engine perfomance",
    font: {
      size: 24,
    },
  },
  xaxis: {
    title: {
      text: "Altitude [m]",
      font: {
        size: 14,
      },
    },
  },
  yaxis: {
    title: {
      text: "Engine power [kW]",
      font: {
        size: 14,
      },
    },
  },
};

const PowerUnitEngineChart = () => {
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const maxAltitude = useEngineStore((state) => state.maxAltitude);
  const kCoefficient = useEngineStore((state) => state.kCoefficient);

  useEffect(() => {
    const trace = powerFunction({
      seaLevelPower: 800,
      engineSpeed: 3000,
      reductionRatio: 0.4,
      maxAltitude: 10010,
      kCoefficient: 0.1,
    });
    console.log(trace);
    Plotly.newPlot("plot", [trace], layout);
  }, []);

  return (
    <div className=" w-full text-bold text-black text-3xl flex flex-col justify-center items-center">
      <div id="plot"></div>
    </div>
  );
};

export default PowerUnitEngineChart;
