import a1_ratio from "./a10_to_a10T";
import a10T from "./a10T";
import { profiles } from "./profileData";
import { degTorad, radTodeg } from "../../misc";
import tanTauAlfa2 from "./tanTauAlfa2";
import effectiveWingSweep from "./effectiveWingSweep";
import a1_0M from "./a1_0M";
import kCoefficient from "./kCorrectionCoeficient";
import tauCoefficient from "./tauCorrectionCoeficient";
import spanCorrection from "./spanCorrection";
import a2_ratio from "./a2_ratio";
import a20T from "./a20T";
import a2_m_ratio from "./a2_m_ratio";

const calculateAcoefs = (
  profileName: string,
  reynoldsNumber: number,
  stabillizer025Sweep: number,
  machNumber: number,
  stabillizerConvergence: number,
  stabillizerAspectRatio: number,
  steerSpans: number[],
  stabillzerSpan: number,
  steerToStabillizerCordRatio:number
) => {
  //Teoretyczna pochodna a1
  let i = profiles.findIndex((prop) => prop.name == profileName);
  let profileData = profiles[i];
  //stopnie
  let tau = radTodeg(
    2 * Math.atan(tanTauAlfa2(profileData.y90, profileData.y99))
  );
  let a1RatioValue = a1_ratio(tau, reynoldsNumber);
  let a10TValue = a10T(tau, profileData.thickness);
  let a10 = a1RatioValue * a10TValue;
  
  //Poprawka o zbieżność i wydłużenie a1
  //stopnie
  let stabillizerEffectiveWingSweep = effectiveWingSweep(
    stabillizer025Sweep,
    machNumber,
    stabillizerAspectRatio,
    stabillizerConvergence
  );
  let a10M = a1_0M(a10, machNumber, stabillizerEffectiveWingSweep);
  console.log({a10:a10,a10M:a10M })
  let corectionTau = tauCoefficient(
    a10M,
    stabillizerEffectiveWingSweep,
    stabillizerAspectRatio,
    stabillizerConvergence
  );
  let correctionk = kCoefficient(stabillizerAspectRatio);

  let a1 =
    1 /
    (1 /
      (a10M * Math.cos(degTorad(stabillizerEffectiveWingSweep)) +
        (1 + corectionTau) * correctionk));

  // Teoretyczna pochodna a2
  let a2RatioValue = a2_ratio(a1RatioValue,steerToStabillizerCordRatio)
  let a20TValue = a20T(profileData.thickness,steerToStabillizerCordRatio)
  let a20 = a2RatioValue*a20TValue

  //Poprawka na liczbę macha a2
  let a2Mratio = a2_m_ratio(steerToStabillizerCordRatio,stabillizerAspectRatio,machNumber)
  let a2M = a20*a10M/a10*a2Mratio

  //Poprawka o rozpiętość a2
  let spanCorrectionCoef = spanCorrection(
    steerSpans,
    stabillzerSpan,
    stabillizerAspectRatio,
    stabillizerConvergence,
    stabillizer025Sweep
  );
  let a2 = a2M * spanCorrectionCoef;
  return { a1: a1, a2:a2 };
};
export default calculateAcoefs;
