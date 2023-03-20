import { density } from "./atmosphere";



interface forceOnTheRodCaclculationData {
  height: number;
  steerArea: number;
  steerCord: number;
  rodLenght: number;
  angularRudderToSteeringGearRatio: number;
  heightSteerHingeMoment: number[];
  velocity: number[];
  velocityRatio: number;
}

export const forceOnTheRodCaclculation = ({
  height,
  steerArea,
  steerCord,
  rodLenght,
  angularRudderToSteeringGearRatio,
  heightSteerHingeMoment,
  velocity,
  velocityRatio,
}: forceOnTheRodCaclculationData) => {
  let forceOnTheRod = heightSteerHingeMoment.map((curr) => curr);
  for (let i = 0; i < forceOnTheRod.length; i++) {
    forceOnTheRod[i] =
      ((density(height) * steerCord * steerArea * rodLenght) /
        -angularRudderToSteeringGearRatio) *
      velocity[i] *
      velocityRatio *
      heightSteerHingeMoment[i];
  }
  return forceOnTheRod;
};

interface heightSteerHingeMomentCalculationData {
  b1: number;
  alfaH: number[];
  b2: number;
  deltaH: number[];
  b3?: number;
  deltaHk?: number;
}

export const heightSteerHingeMomentCalculation = ({
  b1,
  alfaH,
  b2,
  deltaH,
  b3,
  deltaHk,
}: heightSteerHingeMomentCalculationData) => {
  let heightSteerHingeMoment = alfaH.map((curr) => curr);
  for (let i = 0; i < heightSteerHingeMoment.length; i++) {
    heightSteerHingeMoment[i] = b1 * alfaH[i] + b2 * deltaH[i];
  }
  if (b3 && deltaHk) {
    heightSteerHingeMoment = heightSteerHingeMoment.map(
      (curr) => curr + b3 * deltaHk
    );
  }
  return heightSteerHingeMoment;
};


interface trimAngleCalculationData{
  b1:number
  b2:number
  b3:number
  alfaH:number
  deltaH:number
}

export const trimAngleCalculation = ({ b1 ,b2,b3,alfaH,deltaH }:trimAngleCalculationData) => {
  return (-b1/b3*alfaH - b2/b3* deltaH)
}
