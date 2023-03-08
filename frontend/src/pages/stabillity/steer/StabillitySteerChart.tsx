import Plotly from "plotly.js-dist-min";
import React, { useEffect } from "react";
import { useLongitudalMomentStore } from "../../../data/stores/useLongitudalMoment";
import { useSteerOutputStore } from "../../../data/stores/useSteer";

const StabillitySteerChart = () => {
  const cz = useLongitudalMomentStore((state) => state.cz);
  const alfa = useLongitudalMomentStore((state) => state.alfa);
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
  }, [traceAlfa, traceCz]);
  return (
    <div>
      <div id="Delta_alfa" />
      <div id="Delta_cz" />
    </div>
  );
};

export default StabillitySteerChart;
