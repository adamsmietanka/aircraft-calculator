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
  const stallVelocity = useWingStore((state) => state.stallVelocity);

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

  const { maxCz, CdOfZeroCl } = useProfileTable(closestIndex, profile) as Row;
  console.log(maxCz, CdOfZeroCl);

  const Cxmin2 = CdOfZeroCl * Math.pow(stallReynolds / 10000000, 0.11);
  const deltaCxRe = (Cz: number) =>
    (Cxmin2 - CdOfZeroCl) * (1 - Math.abs(Cz / maxCz));

  return {
    area,
    aspectRatio,
    taperRatio,
    meanAerodynamicChord,
    stallReynolds,
    pointsCl,
    pointsCd: pointsCd.map(([y, x, z]) => [y + deltaCxRe(x), x, z]),
  };
};

export default useWingAerodynamics;
