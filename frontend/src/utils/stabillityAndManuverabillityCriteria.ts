import { density } from "./atmosphere";
import { calculatekappaH0 } from "./stabillityCenteresandReserves";

export const calculateDeltaHtodV = (
  mass: number,
  hN: number,
  wingArea: number,
  velocity: number,
  height: number,
  a2: number,
  rudderArea: number,
  rudderWingdistance: number,
  MAC: number,
  velocityRatio: number
) => {
  let kappaH0 = calculatekappaH0(
    rudderArea,
    rudderWingdistance,
    wingArea,
    MAC,
    velocityRatio
  );
  return (
    (4 * mass * 9.81 * hN) /
    (density(height) * wingArea * kappaH0 * a2 * Math.pow(velocity, 3))
  );
};

export const calculatedPdhTodV = (
  mass: number,
  hNprim: number,
  velocity: number,
  a2: number,
  angularRudderToSteeringGearRatio: number,
  trimArea: number,
  trimCord: number,
  MAC: number,
  b2: number,
  rudderWingdistance: number,
  rudderArea: number,
  rodLenght: number
) => {
  return (
    -2 *
    mass *
    9.81 *
    -angularRudderToSteeringGearRatio *
    ((trimArea * trimCord * MAC * b2) /
      (rudderArea * rudderWingdistance * rodLenght * a2 * velocity)) *
    hNprim
  );
};

export const calculatedDeltaHtoMg = (
  mass: number,
  hM: number,
  velocity: number,
  height: number,
  a2: number,
  MAC: number,
  rudderWingdistance: number,
  rudderArea: number
) => {
  return (
    ((-2 * mass * 9.81 * MAC) /
      (density(height) *
        rudderArea *
        rudderWingdistance *
        a2 *
        Math.pow(velocity, 2))) *
    hM
  );
};

export const calculatedPdhToMg = (
  mass: number,
  hMprim: number,
  a2: number,
  angularRudderToSteeringGearRatio: number,
  trimArea: number,
  trimCord: number,
  MAC: number,
  b2: number,
  rudderWingdistance: number,
  rudderArea: number,
  rodLenght: number,
  velocity:number
) => {
  return (
    mass *
    9.81 *
    angularRudderToSteeringGearRatio *
    ((trimArea * trimCord * MAC * b2) /
      (rudderArea * rudderWingdistance * rodLenght * a2 * velocity)) *
    hMprim
  );
};
