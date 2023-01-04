import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-dist-min";
import { useForceOnTheRodStore } from "../../utils/useForceOnTheRod";
import { useLongitudalMomentStore } from "../../utils/useLongitudalMoment";
import { useCenterOfStabillityStore } from "../../utils/useCenterOfStabillity";
const layouts = (type: string) => {
  let layout = {
    tittle: { text: "Centers of Stabillity and Manouverablillity" },
    xaxis: { title: { text: "Cz [-]" } },
    yaxis: { title: { text: "x_N, x_N', x_M , x_M' [-]" } },
  };
  switch (type) {
    case "CentersOfStabillityToCz":
      break;
    case "CentersOfStabillityToV":
      layout = { ...layout, xaxis: { title: { text: "V [m/s]" } } };
      break;
  }
  return layout;
};

const StabillityChartsCenterOfStabillityCharts = () => {
  const centers = useCenterOfStabillityStore();

  const czArray = useLongitudalMomentStore((state) => state.cz);
  const velocityArray = useForceOnTheRodStore((state) => state.velocity);
  const Plots = ["CentersOfStabillityToCz", "CentersOfStabillityToV"];

  const traces = (type: string) => {
    let trace = [{ x: [1], y: [1], name: "x_n" }];
    switch (type) {
      case "CentersOfStabillityToCz":
        trace = [
          { x: czArray, y: centers.xN, name: "x_n" },
          { x: czArray, y: centers.xNprim, name: "x_n\'" },
          { x: czArray, y: centers.xM, name: "x_m" },
          { x: czArray, y: centers.xMprim, name: "x_m\'" },
        ];
        break;
      case "CentersOfStabillityToV":
        trace = [
          { x: velocityArray, y: centers.xN, name: "x_n" },
          { x: velocityArray, y: centers.xNprim,name: "x_n\'" },
          { x: velocityArray, y: centers.xM, name: "x_m"},
          { x: velocityArray, y: centers.xMprim,name: "x_m\'" },
        ];
        break;
    }
    return trace;
  };

  useEffect(() => {
    Plots.map((plot) => {
      Plotly.newPlot(plot, traces(plot), layouts(plot));
    });
  }, [Plots, centers]);
  return (
    <div>
      {Plots.map((plot) => (
        <div id={plot} />
      ))}
    </div>
  );
};

export default StabillityChartsCenterOfStabillityCharts;
