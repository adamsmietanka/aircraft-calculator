import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-dist-min";
import {
  useForceOnTheRodOutputStore,
  useForceOnTheRodStore,
} from "../../../data/stores/useForceOnTheRod";
import { useLongitudalMomentStore } from "../../../data/stores/useLongitudalMoment";
import { useCenterOfStabillityStore } from "../../../data/stores/useCenterOfStabillity";
import { useSteerOutputStore, useSteerStore } from "../../../data/stores/useSteer";
import {
  calculateXm,
  calculateXmPrim,
  calculateXn,
  calculateXnPrim,
} from "../../../utils/stabillityCenteresandReserves";
import { degTorad } from "../../../utils/misc";
const layouts = (type: string) => {
  let layout = {
    tittle:"Centers of Stabillity and Manouverablillity" ,
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

  const velocityRatio = useSteerStore((state) => state.speedDifference);
  const rudderArea = useSteerStore((state) => state.sh);
  const wingArea = useLongitudalMomentStore((state) => state.S);
  const dEpsTodAlfa = useSteerOutputStore((state) => state.dEpsTodAlfa);
  const a = useSteerStore((state) => state.a);
  const a1 = useSteerOutputStore((state) => state.a1);
  const rudderWingdistance = useSteerStore((state) => state.x_h);
  const MAC = useLongitudalMomentStore((state) => state.c_a);
  const xSA = useLongitudalMomentStore((state) => state.x_sa);
  const zSc = useLongitudalMomentStore((state) => state.z_sc);
  const zSa = useLongitudalMomentStore((state) => state.z_sa);

  const a2 = useSteerOutputStore((state) => state.a2);
  const b1 = useForceOnTheRodOutputStore((state) => state.b1);
  const b2 = useForceOnTheRodOutputStore((state) => state.b2);
  const mass = useSteerStore((state) => state.mass);

  const height = useForceOnTheRodStore((state) => state.height);
  //brak wcześniejszych wywołań pierwsze możnaby wyprowdzic z obliczeń
  const DeltaXSAj = -0.0534;
  const LambdaE = 4.94;
  const alfa0 = degTorad(-3.75)
  const Plots = ["CentersOfStabillityToCz", "CentersOfStabillityToV"];

  const traces = (type: string) => {
    let trace = [{ x: [1], y: [1], name: "x_n" }];
    switch (type) {
      case "CentersOfStabillityToCz":
        trace = [
          { x: czArray, y: centers.xN, name: "x_n" },
          { x: czArray, y: centers.xNprim, name: "x_n'" },
          { x: czArray, y: centers.xM, name: "x_m" },
          { x: czArray, y: centers.xMprim, name: "x_m'" },
        ];
        break;
      case "CentersOfStabillityToV":
        trace = [
          { x: velocityArray, y: centers.xN, name: "x_n" },
          { x: velocityArray, y: centers.xNprim, name: "x_n'" },
          { x: velocityArray, y: centers.xM, name: "x_m" },
          { x: velocityArray, y: centers.xMprim, name: "x_m'" },
        ];
        break;
    }
    return trace;
  };
  useEffect(() => {
    centers.setXn(
      czArray.map((Cz) =>
        calculateXn(
          velocityRatio,
          rudderArea,
          wingArea,
          dEpsTodAlfa,
          a,
          a1,
          rudderWingdistance,
          MAC,
          xSA,
          DeltaXSAj,
          zSc,
          zSa,
          Cz,
          LambdaE,
          alfa0
        )
      )
    );
    console.log("xN:" + centers.xN);
  }, [
    centers.setXn,
    velocityRatio,
    rudderArea,
    wingArea,
    dEpsTodAlfa,
    a,
    a1,
    rudderWingdistance,
    MAC,
    xSA,
    DeltaXSAj,
    zSc,
    zSa,
    LambdaE,
    alfa0,
  ]);

  useEffect(() => {
    centers.setXm(
      czArray.map((Cz) =>
        calculateXm(
          velocityRatio,
          rudderArea,
          wingArea,
          dEpsTodAlfa,
          a,
          a1,
          rudderWingdistance,
          MAC,
          xSA,
          DeltaXSAj,
          zSc,
          zSa,
          Cz,
          LambdaE,
          alfa0,
          mass,
          height
        )
      )
    );
    console.log("x_m:" + centers.xM);
  }, [
    centers.setXn,
    velocityRatio,
    rudderArea,
    wingArea,
    dEpsTodAlfa,
    a,
    a1,
    rudderWingdistance,
    MAC,
    xSA,
    DeltaXSAj,
    zSc,
    zSa,
    LambdaE,
    alfa0,
    mass,
    height,
  ]);

  useEffect(() => {
    centers.setXnPrim(
      czArray.map((Cz) =>
        calculateXnPrim(
          velocityRatio,
          rudderArea,
          wingArea,
          dEpsTodAlfa,
          a,
          a1,
          rudderWingdistance,
          MAC,
          xSA,
          DeltaXSAj,
          zSc,
          zSa,
          Cz,
          LambdaE,
          alfa0,
          a2,
          b1,
          b2
        )
      )
    );
    console.log("x_N':" + centers.xNprim);
  }, [
    centers.setXnPrim,
    velocityRatio,
    rudderArea,
    wingArea,
    dEpsTodAlfa,
    a,
    a1,
    rudderWingdistance,
    MAC,
    xSA,
    DeltaXSAj,
    zSc,
    zSa,
    LambdaE,
    alfa0,
    a2,
    b1,
    b2,
  ]);

  useEffect(() => {
    centers.setXmprim(
      czArray.map((Cz) =>
        calculateXmPrim(
          velocityRatio,
          rudderArea,
          wingArea,
          dEpsTodAlfa,
          a,
          a1,
          rudderWingdistance,
          MAC,
          xSA,
          DeltaXSAj,
          zSc,
          zSa,
          Cz,
          LambdaE,
          alfa0,
          a2,
          b1,
          b2,
          mass,
          height
        )
      )
    );
    console.log("x_m':" + centers.xMprim);
  }, [
    centers.setXmprim,
    velocityRatio,
    rudderArea,
    wingArea,
    dEpsTodAlfa,
    a,
    a1,
    rudderWingdistance,
    MAC,
    xSA,
    DeltaXSAj,
    zSc,
    zSa,
    LambdaE,
    alfa0,
    a2,
    b1,
    b2,
    mass,
    height,
  ]);

  useEffect(() => {
    Plots.map((plot) => {
      Plotly.newPlot(plot, traces(plot), layouts(plot));
    });
  }, [Plots, centers]);
  return (
    <div>
      {Plots.map((plot) => (
        <div key={plot} id={plot} />
      ))}
    </div>
  );
};

export default StabillityChartsCenterOfStabillityCharts;
