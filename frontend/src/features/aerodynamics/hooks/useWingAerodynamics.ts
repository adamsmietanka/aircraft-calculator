import { reynolds } from "../data/profiles";
import { useWingStore } from "../stores/useWing";
import useProfileData from "./useProfileData";
import useProfileTable, { Row } from "./useProfileTable";

const useClosestReynolds = (stallReynolds: number) => {
  const profile = useWingStore((state) => state.profile);
  const closest = reynolds[profile].map((re) =>
    Math.abs(stallReynolds - re * 1000000)
  );
  let closestIndex = closest.reduce(
    (index, value, i, array) => (value < array[index] ? i : index),
    0
  );
  return closestIndex;
};

const useWingAerodynamics = () => {
  const profile = useWingStore((state) => state.profile);
  const span = useWingStore((state) => state.span);
  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);
  const stallVelocity = useWingStore((state) => state.stallVelocity);
  const material = useWingStore((state) => state.material);

  const KINEMATIC_VISCOSITY = 1.4207e-5;

  const area = ((chord + chordTip) * span) / 2;
  const aspectRatio = (span * span) / area;
  const taperRatio = chordTip / chord;

  const meanAerodynamicChord =
    (2 * chord * (1 + taperRatio + taperRatio * taperRatio)) /
    (3 * (1 + taperRatio));

  const stallReynolds =
    (stallVelocity * meanAerodynamicChord) / KINEMATIC_VISCOSITY;

  const closestIndex = useClosestReynolds(stallReynolds);
  const { pointsCl, pointsCd } = useProfileData(closestIndex);

  const { maxCz, CdOfZeroCl, slope } = useProfileTable(
    closestIndex,
    profile
  ) as Row;

  const Cxmin2 = CdOfZeroCl * Math.pow(stallReynolds / 10000000, 0.11);
  const deltaCxRe = (Cz: number) =>
    (Cxmin2 - CdOfZeroCl) * (1 - Math.abs(Cz / maxCz));

  const CdMaterial = CdOfZeroCl * (material ? 0.15 : 0.5);

  const getFirstGlauertCoefficient = () => {
    const tau1 =
      0.023 * Math.pow(aspectRatio / slope, 3) -
      0.103 * Math.pow(aspectRatio / slope, 2) +
      (0.25 * aspectRatio) / slope;
    const tau2 =
      -0.18 * Math.pow(taperRatio, 5) +
      1.52 * Math.pow(taperRatio, 4) -
      3.51 * Math.pow(taperRatio, 3) +
      3.5 * Math.pow(taperRatio, 2) -
      1.33 * taperRatio +
      0.17;
    return (tau1 * tau2) / 0.17;
  };

  const firstGlauertCoefficient = getFirstGlauertCoefficient();

  const getAlphaInduced = (Cl: number) =>
    ((Cl / (Math.PI * aspectRatio)) * (1 + firstGlauertCoefficient) * 180) /
    Math.PI;

  const getBeta25 = () => {
    const xTip = (Math.tan((angle * Math.PI) / 180) * span) / 2;
    const x = xTip + (chordTip - chord) / 4;
    return (Math.atan((2 * x) / span) * 180) / Math.PI;
  };

  const getSecondGlauertCoefficient = () => {
    const beta25 = getBeta25();
    const delta1 = (0.0537 * aspectRatio) / slope - 0.005;
    const delta2 =
      -0.43 * Math.pow(taperRatio, 5) +
      1.83 * Math.pow(taperRatio, 4) -
      3.06 * Math.pow(taperRatio, 3) +
      2.56 * Math.pow(taperRatio, 2) -
      taperRatio +
      0.148;
    const delta3 =
      (-2.2e-7 * Math.pow(aspectRatio, 3) +
        1e-7 * Math.pow(aspectRatio, 2) +
        1.6e-5) *
        Math.pow(beta25, 3) +
      1;
    return (delta1 * delta2 * delta3) / 0.048;
  };
  const secondGlauertCoefficient = getSecondGlauertCoefficient();

  const getCdInduced = (Cl: number) =>
    ((Cl * Cl) / (Math.PI * aspectRatio)) * (1 + secondGlauertCoefficient);

  const getCdWing = (Cl: number, Cd: number) => {
    return Cd + deltaCxRe(Cl) + CdMaterial + getCdInduced(Cl);
  };

  return {
    area,
    aspectRatio,
    taperRatio,
    meanAerodynamicChord,
    stallReynolds,
    cl: pointsCl,
    cd: pointsCd,
    inducedCd: pointsCd.map(([y, x, z]) => [getCdInduced(x), x, z]),
    wingCl: pointsCl.map(([x, y, z]) => [x + getAlphaInduced(y), y, z]),
    wingCd: pointsCd.map(([y, x, z]) => [getCdWing(x, y), x, z]),
  };
};

export default useWingAerodynamics;
