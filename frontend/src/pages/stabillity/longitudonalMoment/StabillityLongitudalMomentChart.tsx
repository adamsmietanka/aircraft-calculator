import Plotly from "plotly.js-dist-min"
import React, { useEffect } from "react";
import {
  useLongitudalMomentOutput,
  useLongitudalMomentStore,
} from "../../../data/stores/useLongitudalMoment";

const StabillityLongitudalMomentChart = () => {
  const cz = useLongitudalMomentStore((state) => state.cz);
  const alfa = useLongitudalMomentStore((state) => state.alfa);
  const cmbu = useLongitudalMomentOutput((state) => state.cmbu);

  const traceAlfa = { x: alfa, y: cmbu };
  const traceCz = { x: cz, y: cmbu };
  const layouts = (type: string) => {
    let layout = {
      tittle:{text:"Longitudonal Moment"}, 
      xaxis:{title:{text:"Cz [-]"}},
      yaxis:{title:{text:"Cm_bu [-]"}}, 
    };
    switch (type) {
      case "alfa":
        layout = { ...layout, xaxis:{title:{text:"\u03B1 [\u25CB]"}}  };
        break;
      case "cz":
        layout = { ...layout, xaxis:{title:{text:"cz [-]"}}};
        break;
    }
    return layout
  };

  useEffect(()=>{
    console.log(traceAlfa)
    Plotly.newPlot("Cmbu_alfa",[traceAlfa],layouts("alfa") )
    Plotly.newPlot("Cmbu_cz",[traceCz],layouts("cz") )
  },[traceAlfa,traceCz ])
  return <div>
    <div id="Cmbu_alfa"/>
    <div id ="Cmbu_cz"/>
  </div>;
};

export default StabillityLongitudalMomentChart;
