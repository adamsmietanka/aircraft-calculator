import Plotly from "plotly.js-dist-min";
import React, { useState, useEffect } from "react";
import StabillityChartsCenterOfStabillityCharts from "../molecules/StabillityChartsCenterOfStabillityCharts";
import StabillityChartsReserveOfStabillityCharts from "../molecules/StabillityChartsReserveOfStabillityCharts";

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
    case "ReservesOfStabillityToCz":
      layout = {
        ...layout,
        tittle: { text: "Reserves of Stabillity and Manouverablillity" },
        yaxis: { title: { text: "h_N, h_N', h_M , h_M' [-]" } },
      };
      break;
    case "ReservessOfStabillityToV":
      layout = {
        tittle: { text: "Reserves of Stabillity and Manouverablillity" },
        yaxis: { title: { text: "h_N, h_N', h_M , h_M' [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
    case "dDeltaHtodV":
      layout = {
        tittle: { text: "Reserves of Stabillity and Manouverablillity" },
        yaxis: { title: { text: "h_N, h_N', h_M , h_M' [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
    case "dPdhtodV":
      layout = {
        tittle: { text: "Reserves of Stabillity and Manouverablillity" },
        yaxis: { title: { text: "h_N, h_N', h_M , h_M' [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
    case "deltaHtomg":
      layout = {
        tittle: { text: "Reserves of Stabillity and Manouverablillity" },
        yaxis: { title: { text: "h_N, h_N', h_M , h_M' [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
    case "dPdHtomg":
      layout = {
        tittle: { text: "Criteria of force to " },
        yaxis: { title: { text: "dP_dH / mg - 1 [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
  }
  return layout;
};

const traces = (type: string) => {
  let trace = [{ x: [1], y: [1] }];
  switch (type) {
    case "CentersOfStabillityToCz":
      break;
    case "CentersOfStabillityToV":
      break;
    case "ReservesOfStabillityToCz":
      break;
    case "ReservessOfStabillityToV":
      break;
    case "dDeltaHtodV":
      break;
    case "dPdhtodV":
      break;
    case "deltaHtomg":
      break;
    case "dPdHtomg":
      break;
  }
  return trace;
};

const StabillityCharts = () => {
  return (
    <div>
      <StabillityChartsCenterOfStabillityCharts />
      <StabillityChartsReserveOfStabillityCharts />
    </div>
  );
};

export default StabillityCharts;
