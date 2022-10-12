import { useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import { useEngineStore } from "../../utils/useEngine";
import { powerFunction } from "../../utils/enginePower";

let layout = {
  title: {
    text: "Engine perfomance",
    font: {
      size: 24,
    },
  },
  xaxis: {
    title: {
      text: "Altitude [km]",
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
  const props = useEngineStore();

  useEffect(() => {
    let trace = powerFunction(props);
    console.log(trace);
    Plotly.newPlot("plot", [trace], layout);
  });

  return (
    <div className=" w-full text-bold text-black text-3xl flex flex-col justify-center items-center">
      <div id="plot"></div>
    </div>
  );
};

export default PowerUnitEngineChart;
