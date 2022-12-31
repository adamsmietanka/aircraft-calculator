import { density } from "./atmosphere";
import { radTodeg } from "./misc";

interface kappaCalculation {
  s: number;
  sh: number;
  configuration: number;
  mac: number;
  xh: number;
  cog: number;
}

interface dEpsTodAlfaCalculation {
  a: number;
  wingAspectRatio: number;
}

interface steerIncilinationAngleCalulation {
  kappa: number;
  a1: number;
  a: number;
  dEpsTodAlfa: number;
  Cmbu: number;
  Cz: number;
}

interface getCzCalculation {
  cruiseVelocity: number;
  cruiseAlttiude: number;
  mass: number;
  wingSurface: number;
}

export const calculateKappa = ({
  s,
  sh,
  configuration,
  mac,
  xh,
  cog,
}: kappaCalculation) => {
  return (((xh / mac - cog) * s) / sh) * configuration;
};

export const calculateDepsToDalfa = ({
  a,
  wingAspectRatio,
}: dEpsTodAlfaCalculation) => {
  return (2 * a) / (Math.PI * wingAspectRatio);
};

export const calculateSteerIncilinationAngle = ({
  kappa,
  a1,
  a,
  dEpsTodAlfa,
  Cmbu,
  Cz,
}: steerIncilinationAngleCalulation) => {
  return Cmbu / (kappa * a1) - (Cz / a) * dEpsTodAlfa;
};

export const getCzFromVelocity = ({
  cruiseVelocity,
  cruiseAlttiude,
  mass,
  wingSurface,
}: getCzCalculation) => {
  return (
    (2 * mass * 9.81) /
    (density(cruiseAlttiude) * cruiseVelocity * cruiseVelocity * wingSurface)
  );
};

interface deltaCalculation {
  Cmbu: number[];
  cz: number[];
  a: number;
  a1: number;
  a2: number;
  kappa: number;
  dEpsTodAlfa: number;
  steerIncilinationAngle: number;
}

export const calculateDelta = ({
  Cmbu,
  cz,
  a,
  a1,
  a2,
  kappa,
  dEpsTodAlfa,
  steerIncilinationAngle,
}: deltaCalculation) => {
  let delta = cz.map((current) => current);
  console.log(delta)
  for (let i = 0; i < delta.length; i++) {
    delta[i] =
      Cmbu[i] / (kappa * a2) -
      (a1 / a2) * ((cz[i] / a) * (1 - dEpsTodAlfa) + steerIncilinationAngle);
      console.log(delta[i]);
  }
  return delta
};
  