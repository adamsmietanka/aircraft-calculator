import { profiles } from "../aCoefficients/profileData";
import { radTodeg } from "../../misc";
import tanTauAlfa2 from "../aCoefficients/tanTauAlfa2";
import b10Ratio from "./b10Ratio";
import a1_ratio from "../aCoefficients/a10_to_a10T";
import b10T from "./b10T";
import a2_ratio from "../aCoefficients/a2_ratio";
import b20Ratio from "./b20Ratio";
import b20T from "./b20T";
import F1correction from "./F1correction";
import a10T from "../aCoefficients/a10T";
import a20T from "../aCoefficients/a20T";
import F3correction from "./F3correction";
import F2correction from "./F2correction";

const bCoefficients = (
  profileName: string,
  reynoldsNumber: number,
  steerToStabillizerChordRatio: number,
  stabillizerAspectRatio:number
) => {
  //a1 - old data
  let i = profiles.findIndex((prop) => prop.name === profileName);
  let profileData = profiles[i];
  //stopnie
  let tau = radTodeg(
    2 * Math.atan(tanTauAlfa2(profileData.y90, profileData.y99))
  );
  let a1RatioValue = a1_ratio(tau, reynoldsNumber);
  let a2RatioValue = a2_ratio(a1RatioValue, steerToStabillizerChordRatio);
  let a10TValue = a10T(tau, profileData.thickness);
  let a10 = a1RatioValue * a10TValue;
  let a20TValue = a20T(profileData.thickness,steerToStabillizerChordRatio)
  let a20 = a2RatioValue*a20TValue

  // b10 - pochodna teoretyczna
  let b10RatioValue = b10Ratio(steerToStabillizerChordRatio, a1RatioValue);
  let b10TValue = b10T(steerToStabillizerChordRatio, profileData.thickness);
  let b10 = b10RatioValue * b10TValue;

  // b20 - pochodna teoretyczna
  let b20RatioValue = b20Ratio(steerToStabillizerChordRatio, a2RatioValue);
  let b20TValue = b20T(steerToStabillizerChordRatio, profileData.thickness);
  let b20 = b20RatioValue * b20TValue;


  //poprawka na zbieżność i wydłużenie
  let F1 = F1correction(stabillizerAspectRatio,a10,steerToStabillizerChordRatio)
  let F2 = F2correction(stabillizerAspectRatio,a10,steerToStabillizerChordRatio)
  let F3 = F3correction(steerToStabillizerChordRatio,0)

  // b1 i b2 final
  let b1 = b10*(1-F1)+F2*F3*a10;
  let b2 = b20 - F2 *a20/a10*b10+F2*F3*a20;
  
  console.log("b1 deveriviatives", {b10T:b10TValue,b10:b10,b1:b1})
  console.log("b2 deveriviatives", {b20T:b20TValue,b20:b20,b2:b2})
  return { b1, b2 };
};
