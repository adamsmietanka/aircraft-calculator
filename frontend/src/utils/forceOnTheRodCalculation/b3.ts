import polynomynalFunction from "../math_estimation/polynomynalFunction";
import { radTodeg } from "../misc";
import { profiles } from "../steerCalculation/aCoefficients/profileData"
import tanTauAlfa2 from "../steerCalculation/aCoefficients/tanTauAlfa2";
interface getB3Data {
  rudderCord: number;
  steerSpan: number;
  steerAftHingeArea: number;
  trimSpan: number;
  trimAftHingeArea: number;
  steerNoseHingeArea: number;
  steerFwdHingeArea: number;
}
export const getB3 = ({
  rudderCord,
  steerSpan,
  steerAftHingeArea,
  trimSpan,
  trimAftHingeArea,
  steerNoseHingeArea,
  steerFwdHingeArea,
}: getB3Data,profileName:string) => {
  let i = profiles.findIndex((prop) => prop.name === profileName);
  let profileData = profiles[i];
  //stopnie
  let tau = radTodeg(
    2 * Math.atan(tanTauAlfa2(profileData.y90, profileData.y99))
  );
  console.log("trailing edge angle",tau)
  let f = getF(tau);
  let cT = trimAftHingeArea / trimSpan;
  let cF = steerAftHingeArea / steerSpan;
  let Cfprim = steerNoseHingeArea / trimSpan;
  let cTtoC = cT / rudderCord;
  let lambda = steerFwdHingeArea / steerNoseHingeArea;
  // - i /10 do usunięcia
  let b3 =
    (f * getY(cTtoC, lambda)) /
    ((steerSpan / trimSpan) * Math.pow(cF / Cfprim, 2))/10;
    console.log("b3",{aspectratio:lambda,
      cTtoC:cTtoC,
        b3:b3})
  return b3;
};

const getY = (cTtoC: number, lambda: number) => {
  let x = cTtoC;
  let z = lambda;
  let coefs = {
    a1: [-1.0757270539818202, 0.24204759910893422, 0.4281237247542439],
    b1: [290.1753279382719, -108.22050136663546, 47.85168296100659],
    c1: [-0.15430695803227373, 1.4119490097507361],
  };
  return (
    polynomynalFunction(z, coefs["a1"]) *
      Math.log(polynomynalFunction(z, coefs["b1"]) * x) +
    polynomynalFunction(z, coefs["c1"])
  );
};
//works ok when steerTrailingEdgeAngle>5
const getF = (steerTrailingEdgeAngle: number) => {
  const coef = [1.21072, 0.014884, -0.00142543];
  let F = 0;
  for (let i = 0; i < coef.length; i++) {
    F = F + coef[i] * Math.pow(steerTrailingEdgeAngle, i);
  }
  return F;
};
