import React, { useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import { useStabillityCriteriaStore } from "../../../data/stores/useStabillityCriterias";
import {
  useForceOnTheRodOutputStore,
  useForceOnTheRodStore,
  useTrimStore,
} from "../../../data/stores/useForceOnTheRod";
import { useSteerOutputStore, useSteerStore } from "../../../data/stores/useSteer";
import { useLongitudalMomentStore } from "../../../data/stores/useLongitudalMoment";
import { degTorad } from "../../../utils/misc";
import { useReservesOfStabillityStore } from "../../../data/stores/useReservesOfstability";
import {
  calculatedDeltaHtoMg,
  calculateDeltaHtodV,
  calculatedPdhTodV,
  calculatedPdhToMg,
} from "../../../utils/stabillityAndManuverabillityCriteria";

const layouts = (type: string) => {
  let layout = {
    tittle: { text: "Centers of Stabillity and Manouverablillity" },
    xaxis: { title: { text: "Cz [-]" } },
    yaxis: { title: { text: "x_N, x_N', x_M , x_M' [-]" } },
  };
  switch (type) {
    case "dDeltaHtodV":
      layout = {
        tittle: { text: "Criteria of steer angle differential to velocity " },
        yaxis: { title: { text: "d\u03B4_H / dV [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
    case "dPdhtodV":
      layout = {
        tittle: { text: "Criteria of force differential to velocity " },
        yaxis: { title: { text: "dP_dH / dV [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
    case "deltaHtomg":
      layout = {
        tittle: {
          text: "Criteria of steer angle differential to load factor ratio ",
        },
        yaxis: { title: { text: "d\u03B4_H / mg - 1 [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
    case "dPdHtomg":
      layout = {
        tittle: {
          text: "Criteria of force differential to load factor ratio ",
        },
        yaxis: { title: { text: "dP_dH / mg - 1 [-]" } },
        xaxis: { title: { text: "V [m/s]" } },
      };
      break;
  }
  return layout;
};

const StabillityChartsCriteriaChart = () => {
  const velocityArray = useForceOnTheRodStore((state) => state.velocity);
  const criterias = useStabillityCriteriaStore();
  const Plots = ["dDeltaHtodV", "dPdhtodV", "deltaHtomg", "dPdHtomg"];

  const hN = useReservesOfStabillityStore((state) => state.hN);
  const hNprim = useReservesOfStabillityStore((state) => state.hNprim);
  const hM = useReservesOfStabillityStore((state) => state.hM);
  const hMprim = useReservesOfStabillityStore((state) => state.hMprim);
  const velocityRatio = useSteerStore((state) => state.speedDifference);
  const rudderArea = useSteerStore((state) => state.sh);
  const wingArea = useLongitudalMomentStore((state) => state.S);
  const rudderWingdistance = useSteerStore((state) => state.x_h);
  const MAC = useLongitudalMomentStore((state) => state.c_a);


  const a2 = useSteerOutputStore((state) => state.a2);
  const b2 = useForceOnTheRodOutputStore((state) => state.b2);
  const mass = useSteerStore((state) => state.mass);
  const angularRudderToSteeringGearRatio = useForceOnTheRodStore(
    (state) => state.angularRudderToSteeringGearRatio
  );
  const trimArea = useTrimStore((state) => state.trimAftHingeArea);
  const trimCord =
    useTrimStore((state) => state.trimAftHingeArea) /
    useTrimStore((state) => state.trimSpan);
  const rodLenght = useForceOnTheRodStore((state) => state.rodLenght);

  const height = useForceOnTheRodStore((state) => state.height);


  const traces = (type: string) => {
    let trace = [{ x: velocityArray, y: [1] }];
    switch (type) {
      case "dDeltaHtodV":
        trace = [{ x: velocityArray, y: criterias.dDeltaHtodV }];
        break;
      case "dPdhtodV":
        trace = [{ x: velocityArray, y: criterias.dPdhtodV }];
        break;
      case "deltaHtomg":
        trace = [{ x: velocityArray, y: criterias.deltaHtomg }];
        break;
      case "dPdHtomg":
        trace = [{ x: velocityArray, y: criterias.dPdHtomg }];
        break;
    }
    return trace;
  };

  useEffect(() => {
    criterias.setdDeltaHtodV(
      hN.map((curr, i) =>
        calculateDeltaHtodV(
          mass,
          curr,
          wingArea,
          velocityArray[i],
          height,
          a2,
          rudderArea,
          rudderWingdistance,
          MAC,
          velocityRatio
        )
      )
    );
  }, [
    criterias.setdDeltaHtodV,
    mass,
    hN,
    wingArea,
    velocityArray,
    height,
    a2,
    rudderArea,
    rudderWingdistance,
    MAC,
    velocityRatio,
  ]);

  useEffect(() => {
    criterias.setdPdhtodV(
      hNprim.map((curr, i) =>
        calculatedPdhTodV(
          mass,
          curr,
          velocityArray[i],
          a2,
          angularRudderToSteeringGearRatio,
          trimArea,
          trimCord,
          MAC,
          b2,
          rudderWingdistance,
          rudderArea,
          rodLenght
        )
      )
    );
  }, [
    criterias.setdPdhtodV,
    mass,
    hNprim,
    velocityArray,
    a2,
    angularRudderToSteeringGearRatio,
    trimArea,
    trimCord,
    MAC,
    b2,
    rudderWingdistance,
    rudderArea,
    rodLenght,
  ]);

  useEffect(() => {
    criterias.setdeltaHtomg(
      hM.map((curr, i) =>
        calculatedDeltaHtoMg(
          mass,
          curr,
          velocityArray[i],
          height,
          a2,
          MAC,
          rudderWingdistance,
          rudderArea
        )
      )
    );
  }, [
    criterias.setdeltaHtomg,
    mass,
    hM,
    velocityArray,
    height,
    a2,
    MAC,
    rudderWingdistance,
    rudderArea,
  ]);

  useEffect(() => {
    criterias.setdPdHtomg(
      hMprim.map((curr, i) =>
        calculatedPdhToMg(
          mass,
          curr,
          a2,
          angularRudderToSteeringGearRatio,
          trimArea,
          trimCord,
          MAC,
          b2,
          rudderWingdistance,
          rudderArea,
          rodLenght,
          velocityArray[i]
        )
      )
    );
  }, [
    criterias.setdPdHtomg,
    mass,
    hMprim,
    a2,
    angularRudderToSteeringGearRatio,
    trimArea,
    trimCord,
    MAC,
    b2,
    rudderWingdistance,
    rudderArea,
    rodLenght,
    velocityArray
  ]);

  useEffect(() => {
    Plots.map((plot) => {
      Plotly.newPlot(plot, traces(plot), layouts(plot));
    });
  }, [Plots, criterias]);

  return (
    <div>
      {Plots.map((plot) => (
        <div key={plot} id={plot} />
      ))}
    </div>
  );
};

export default StabillityChartsCriteriaChart;
