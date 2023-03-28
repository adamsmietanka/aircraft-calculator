import Plotly from "plotly.js-dist-min";
import React, { useEffect } from "react";
import { usePositiveOutput } from "../../../data/stores/useLongitudalMoment";
import { useSteerOutputStore } from "../../../data/stores/useSteer";

const StabillitySteerChart = () => {
  const cz = usePositiveOutput((state) => state.cz);
  const alfa = usePositiveOutput((state) => state.alfa);
  const delta = useSteerOutputStore((state) => state.delta);

  const traceAlfa = { x: alfa, y: delta };
  const traceCz = { x: cz, y: delta };
  const layouts = (type: string) => {
    let layout = {
      tittle: { text: "Elevator angle" },
      xaxis: { title: { text: "Cz [-]" } },
      yaxis: { title: { text: "\u03B4_H [rad]" } },
    };
    switch (type) {
      case "alfa":
        layout = {
          ...layout,
          xaxis: { title: { text: "\u03B1 [\u25CB]" } },
        };
        break;
      case "cz":
        layout = { ...layout, xaxis: { title: { text: "Cz [-]" } } };
        break;
    }
    return layout;
  };

  useEffect(() => {
    Plotly.newPlot("Delta_alfa", [traceAlfa], layouts("alfa"));
    Plotly.newPlot("Delta_cz", [traceCz], layouts("cz"));
    console.log("alfa array length:",alfa.length)
    console.log("cz array length:",cz.length)
    console.log("delta array length:",delta.length)
  }, [traceAlfa, traceCz]);
  return (
    <div>
      <div id="Delta_alfa" />
      <div id="Delta_cz" />
    </div>
  );
};

export default StabillitySteerChart;
