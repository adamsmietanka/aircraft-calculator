import { density } from "./atmosphere";
import { powerUnitSteps } from "./steps";

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
        angularRudderToSteeringGearRatio) *
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

interface getB3Data {
  rudderCord:number
  steerSpan: number;
  steerAftHingeArea: number;
  trimSpan: number;
  trimAftHingeArea: number;
  steerNoseHingeArea: number;
  steerFwdHingeArea: number;
  steerTrailingEdgeAngle: number;
}
export const getB3 = ({
  rudderCord,
  steerSpan,
  steerAftHingeArea,
  trimSpan,
  trimAftHingeArea,
  steerNoseHingeArea,
  steerFwdHingeArea,
  steerTrailingEdgeAngle,
}: getB3Data) => {
  const f = getF(steerTrailingEdgeAngle)
  const cT = (trimAftHingeArea/trimSpan)
  const cF = steerAftHingeArea/ steerSpan
  const Cfprim = steerNoseHingeArea/trimSpan
  const cTtoC = cT/rudderCord
  const lambda = steerFwdHingeArea/steerNoseHingeArea
  return (-f*getY(cTtoC,lambda)/((steerSpan/trimSpan)*Math.pow((cF/Cfprim),2)))
};
const getY =(cTtoC: number ,lambda:number ) => {
  //under construction
  return lambda
}
//works ok when steerTrailingEdgeAngle>5
const getF = (steerTrailingEdgeAngle: number) => {
  const coef = [1.21072, 0.014884, -0.00142543];
  let F = 0;
  for (let i=0; i<coef.length; i++){
    F = F+coef[i]*Math.pow(steerTrailingEdgeAngle,i)
  }
  return F
};
