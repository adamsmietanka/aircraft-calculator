import React, { useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import { useCenterOfStabillityStore } from "../../utils/useCenterOfStabillity";
import { useLongitudalMomentStore } from "../../utils/useLongitudalMoment";
import { useForceOnTheRodStore } from "../../utils/useForceOnTheRod";
import { useReservesOfStabillityStore } from "../../utils/useReservesOfstability";
import { reserve } from "../../utils/stabillityCenteresandReserves";

const layouts = (type: string) => {
  let layout = {
    tittle: { text: "Centers of Stabillity and Manouverablillity" },
    xaxis: { title: { text: "Cz [-]" } },
    yaxis: { title: { text: "x_N, x_N', x_M , x_M' [-]" } },
    showlegend: true,
  };
  switch (type) {
    case "ReservesOfStabillityToCz":
      layout = {
        ...layout,
        xaxis: { title: { text: "Cz [-]" } },
        tittle: { text: "Reserves of Stabillity and Manouverablillity" },
        yaxis: { title: { text: "h_N, h_N', h_M , h_M' [-]" } },
      };
      break;
    case "ReservessOfStabillityToV":
      layout = {
        ...layout,
        tittle: { text: "Reserves of Stabillity and Manouverablillity" },
        yaxis: { title: { text: "h_N, h_N', h_M , h_M' [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
  }
  return layout;
};

const StabillityChartsReserveOfStabillityCharts = () => {
  const centers = useCenterOfStabillityStore();
  const CoG = useLongitudalMomentStore((state) => state.x_sc);
  const reserves = useReservesOfStabillityStore();
  const czArray = useLongitudalMomentStore((state) => state.cz);
  const velocityArray = useForceOnTheRodStore((state) => state.velocity);
  const Plots = ["ReservesOfStabillityToCz", "ReservessOfStabillityToV"];

  const traces = (type: string) => {
    let trace = [
      {
        x: [1],
        y: [1],
        name: "First Trace",
      },
    ];
    switch (type) {
      case "ReservesOfStabillityToCz":
        trace = [
          { x: czArray, y: reserves.hN, name: "h_n" },
          { x: czArray, y: reserves.hNprim, name: "h_n'" },
          { x: czArray, y: reserves.hM, name: "h_m" },
          { x: czArray, y: reserves.hMprim, name: "h_m'" },
        ];
        break;
      case "ReservessOfStabillityToV":
        trace = [
          { x: velocityArray, y: reserves.hN, name: "h_n" },
          { x: velocityArray, y: reserves.hNprim, name: "h_n'" },
          { x: velocityArray, y: reserves.hM, name: "h_m" },
          { x: velocityArray, y: reserves.hMprim, name: "h_m'" },
        ];
        break;
    }
    return trace;
  };

  useEffect(() => {
    reserves.setHn(centers.xN.map((center) => reserve(center, CoG)));
  }, [reserves.setHn, centers.xN]);

  useEffect(() => {
    reserves.setHnPrim(centers.xNprim.map((center) => reserve(center, CoG)));
  }, [reserves.setHnPrim, centers.xNprim]);

  useEffect(() => {
    reserves.setHm(centers.xM.map((center) => reserve(center, CoG)));
  }, [reserves.setHm, centers.xM]);

  useEffect(() => {
    reserves.setHmprim(centers.xMprim.map((center) => reserve(center, CoG)));
  }, [reserves.setHmprim, centers.xMprim]);

  useEffect(() => {
    Plots.map((plot) => {
      Plotly.newPlot(plot, traces(plot), layouts(plot));
    });
  }, [Plots, reserves]);
  return (
    <div>
      {Plots.map((plot) => (
        <div key = {plot} id={plot} />
      ))}
    </div>
  );
};

export default StabillityChartsReserveOfStabillityCharts;
