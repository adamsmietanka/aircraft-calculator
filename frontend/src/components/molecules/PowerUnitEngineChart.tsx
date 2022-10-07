import React, { useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import { useEngineStore } from "../../utils/useEngine";
import { density } from "../../utils/atmosphere";

interface powerInput {
  seaLevelPower: number;
  engineSpeed: number;
  reductionRatio: number;
  maxAltitude: number;
  kCoefficient: number;
  halfSupercharger?: { endAltitude: number; endPower: number };
  endSupercharger?: { endAltitude: number; endPower: number };
}
const altitudeArrayCreator = (
  maxAltitude: number,
  halfSuperchargerendAltitude?: number,
  endSuperchargerendAltitude?: number
) => {
  let altitudes = Array.from(
    { length: Math.floor(maxAltitude / 100) },
    (_, i) => 100 * i
  );
  altitudes = [...altitudes, maxAltitude];

  if (
    halfSuperchargerendAltitude &&
    altitudes.includes(halfSuperchargerendAltitude) === false
  ) {
    altitudes = [...altitudes, halfSuperchargerendAltitude];
    altitudes.sort(function (a, b) {
      return a - b;
    });
  }

  if (
    endSuperchargerendAltitude &&
    altitudes.includes(endSuperchargerendAltitude) === false
  ) {
    altitudes = [...altitudes, endSuperchargerendAltitude];
    altitudes.sort(function (a, b) {
      return a - b;
    });
  }
  return altitudes;
};
const superchargerPower = (altitude: number,superchargerStartAltitude:number, superchargerEndAltitude:number,superchargerStartPower:number, superchargerEndPower:number) =>{
  return (superchargerStartPower +(superchargerEndPower - superchargerStartPower) /(superchargerEndAltitude-superchargerStartAltitude) *altitude);
}
const normalPower = (altitude: number,startAltitude:number, startPower:number, kCoefficient:number) =>{
  return (startPower *(density(altitude) / density(startAltitude) - kCoefficient) / (1 - kCoefficient));
}
const powerArrayCreator = (altitude: number, props: powerInput) => {
  let power = normalPower(altitude,0, props.seaLevelPower ,props.kCoefficient);

  if (props.halfSupercharger && altitude <= props.halfSupercharger.endAltitude) {
    power = superchargerPower(altitude,0,props.halfSupercharger.endAltitude,props.seaLevelPower ,props.halfSupercharger.endPower)
  } else if (props.halfSupercharger && altitude > props.halfSupercharger.endAltitude){
    power = normalPower(altitude,props.halfSupercharger.endAltitude, props.halfSupercharger.endPower ,props.kCoefficient);
  }
  return power;
};
const powerFunction = (props: powerInput) => {
  let altitudes = altitudeArrayCreator(
    props.maxAltitude,
    props.halfSupercharger?.endAltitude,
    props.endSupercharger?.endAltitude
  );

  console.log(altitudes);
  let power = Array.from(altitudes, (altitude) => powerArrayCreator(altitude, props));
  return { x: altitudes, y: power };
};

let layout = {
  title: {
    text: "Engine perfomance",
    font: {
      size: 24,
    },
  },
  xaxis: {
    title: {
      text: "Altitude [m]",
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
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const maxAltitude = useEngineStore((state) => state.maxAltitude);
  const kCoefficient = useEngineStore((state) => state.kCoefficient);

  useEffect(() => {
    const trace = powerFunction({
      seaLevelPower: 800,
      engineSpeed: 3000,
      reductionRatio: 0.4,
      maxAltitude: 10010,
      kCoefficient: 0.1,
      halfSupercharger: { endAltitude: 3010, endPower: 1000 },
    });
    console.log(trace);
    Plotly.newPlot("plot", [trace], layout);
  }, []);

  return (
    <div className=" w-full text-bold text-black text-3xl flex flex-col justify-center items-center">
      <div id="plot"></div>
    </div>
  );
};

export default PowerUnitEngineChart;
