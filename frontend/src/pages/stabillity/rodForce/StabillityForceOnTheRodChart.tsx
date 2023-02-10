import React, { useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import {
  useForceOnTheRodOutputStore,
  useForceOnTheRodStore,
} from "../../../data/stores/useForceOnTheRod";

const StabillityForceOnTheRodChart = () => {
  const P = useForceOnTheRodOutputStore((state) => state.forceOnTheRod);
  const velocity = useForceOnTheRodStore((state) => state.velocity);

  const trace = { x: velocity, y: P };

  const layouts = () => {
    let layout = {
      tittle: { text: "Force on the Rod" },
      xaxis: { title: { text: "V [m/s]" } },
      yaxis: { title: { text: "Force on the rod [N]" } },
    };
    return layout;
  };

  useEffect(() => {
    Plotly.newPlot("ForceOTheRod", [trace], layouts());
  }, [trace]);
  
  return (
    <div>
      <div id="ForceOTheRod" />
    </div>
  );
};

export default StabillityForceOnTheRodChart;
