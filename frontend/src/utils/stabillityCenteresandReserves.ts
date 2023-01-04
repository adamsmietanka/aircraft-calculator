import { density } from "./atmosphere";

export const reserve = (Center: number, CoG: number) => {
  return Center - CoG;
};

const calculatekappaH0 = (
  rudderArea: number,
  rudderWingdistance: number,
  wingArea: number,
  MAC: number,
  velocityRatio: number
) => {
  return ((rudderArea * rudderWingdistance) / (wingArea * MAC)) * velocityRatio;
};

const calculateMi0 = (
  mass: number,
  height: number,
  wingArea: number,
  rudderWingdistance: number
) => {
  return mass / (0.5 * density(height) * wingArea * rudderWingdistance);
};

const calculateKghn = (
  velocityRatio: number,
  rudderArea: number,
  wingArea: number,
  dEpsTodAlfa: number,
  a: number,
  a1: number
) => {
  return (
    1 /
    (1 +
      (((rudderArea / wingArea) * a1) / a) * velocityRatio * (1 - dEpsTodAlfa))
  );
};

export const calculateXn = (
  velocityRatio: number,
  rudderArea: number,
  wingArea: number,
  dEpsTodAlfa: number,
  a: number,
  a1: number,
  rudderWingdistance: number,
  MAC: number,
  xSA: number,
  DeltaXSAj: number,
  zSc: number,
  zSa: number,
  Cz: number,
  LambdaE: number,
  alfa0: number
) => {
  let Kghn = calculateKghn(
    velocityRatio,
    rudderArea,
    wingArea,
    dEpsTodAlfa,
    a,
    a1
  );
  let kappaH0 = calculatekappaH0(
    rudderArea,
    rudderWingdistance,
    wingArea,
    MAC,
    velocityRatio
  );
  return (
    Kghn *
    (xSA +
      DeltaXSAj +
      (zSc - zSa) * (2 * Cz * (1 / (Math.PI * LambdaE) - 1 / a) - alfa0) +
      ((kappaH0 * a1) / a) * (1 - dEpsTodAlfa))
  );
};

const calculateKghnPrim = (
  velocityRatio: number,
  rudderArea: number,
  wingArea: number,
  dEpsTodAlfa: number,
  a: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number
) => {
  return (
    1 /
    (1 +
      (((rudderArea / wingArea) * a1) / a) *
        velocityRatio *
        (1 - dEpsTodAlfa) *
        (1 - ((a2 / a1) * b1) / b2))
  );
};

export const calculateXnPrim = (
  velocityRatio: number,
  rudderArea: number,
  wingArea: number,
  dEpsTodAlfa: number,
  a: number,
  a1: number,
  rudderWingdistance: number,
  MAC: number,
  xSA: number,
  DeltaXSAj: number,
  zSc: number,
  zSa: number,
  Cz: number,
  LambdaE: number,
  alfa0: number,
  a2: number,
  b1: number,
  b2: number
) => {
  let kappaH0 = calculatekappaH0(
    rudderArea,
    rudderWingdistance,
    wingArea,
    MAC,
    velocityRatio
  );
  let KghnPrim = calculateKghnPrim(
    velocityRatio,
    rudderArea,
    wingArea,
    dEpsTodAlfa,
    a,
    a1,
    a2,
    b1,
    b2
  );
  return (
    KghnPrim *
    (xSA +
      DeltaXSAj +
      (zSc - zSa) * (2 * Cz * (1 / (Math.PI * LambdaE) - 1 / a) - alfa0) +
      ((kappaH0 * a1) / a) * (1 - dEpsTodAlfa) * (1 - ((a2 / a1) * b1) / b2))
  );
};

const calculateKghm = (
  velocityRatio: number,
  rudderArea: number,
  wingArea: number,
  dEpsTodAlfa: number,
  a: number,
  a1: number,
  mi0: number
) => {
  return (
    1 /
    (1 +
      (((rudderArea / wingArea) * a1) / a) *
        velocityRatio *
        (1 - dEpsTodAlfa + (2 * a) / mi0))
  );
};

export const calculateXm = (
  velocityRatio: number,
  rudderArea: number,
  wingArea: number,
  dEpsTodAlfa: number,
  a: number,
  a1: number,
  rudderWingdistance: number,
  MAC: number,
  xSA: number,
  DeltaXSAj: number,
  zSc: number,
  zSa: number,
  Cz: number,
  LambdaE: number,
  alfa0: number,
  mass: number,
  height: number
) => {
  let kappaH0 = calculatekappaH0(
    rudderArea,
    rudderWingdistance,
    wingArea,
    MAC,
    velocityRatio
  );
  let mi0 = calculateMi0(mass, height, wingArea, rudderWingdistance);
  let Kghm = calculateKghm(
    velocityRatio,
    rudderArea,
    wingArea,
    dEpsTodAlfa,
    a,
    a1,
    mi0
  );
  return (
    Kghm *
    (xSA +
      DeltaXSAj +
      (zSc - zSa) * (2 * Cz * (1 / (Math.PI * LambdaE) - 1 / a) - alfa0) +
      ((kappaH0 * a1) / a) * (1 - dEpsTodAlfa + a / mi0))
  );
};

const calculateKghmPrim = (
  velocityRatio: number,
  rudderArea: number,
  wingArea: number,
  dEpsTodAlfa: number,
  a: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number,
  mi0: number
) => {
  return (
    1 /
    (1 +
      (((rudderArea / wingArea) * a1) / a) *
        velocityRatio *
        (1 - dEpsTodAlfa + (2 * a) / mi0) *
        (1 - ((a2 / a1) * b1) / b2))
  );
};

export const calculateXmPrim = (
  velocityRatio: number,
  rudderArea: number,
  wingArea: number,
  dEpsTodAlfa: number,
  a: number,
  a1: number,
  rudderWingdistance: number,
  MAC: number,
  xSA: number,
  DeltaXSAj: number,
  zSc: number,
  zSa: number,
  Cz: number,
  LambdaE: number,
  alfa0: number,
  a2: number,
  b1: number,
  b2: number,
  mass: number,
  height: number
) => {
  let kappaH0 = calculatekappaH0(
    rudderArea,
    rudderWingdistance,
    wingArea,
    MAC,
    velocityRatio
  );
  let mi0 = calculateMi0(mass, height, wingArea, rudderWingdistance);
  let KghmPrim = calculateKghmPrim(
    velocityRatio,
    rudderArea,
    wingArea,
    dEpsTodAlfa,
    a,
    a1,
    a2,
    b1,
    b2,
    mi0
  );

  return (
    KghmPrim *
    (xSA +
      DeltaXSAj +
      (zSc - zSa) * (2 * Cz * (1 / (Math.PI * LambdaE) - 1 / a) - alfa0) +
      ((kappaH0 * a1) / a) *
        (1 - dEpsTodAlfa + a / mi0) *
        (1 - ((a2 / a1) * b1) / b2))
  );
};
