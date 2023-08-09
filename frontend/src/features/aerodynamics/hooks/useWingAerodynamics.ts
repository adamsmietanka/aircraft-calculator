import round from "../../../utils/interpolation/round";
import { useWingStore } from "../stores/useWing";

const useWingAerodynamics = () => {
  const wing = useWingStore();
  const span = useWingStore((state) => state.span);
  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);

  const area = ((chord + chordTip) * span) / 2;
  const aspectRatio = (span * span) / area;
  const taperRatio = chordTip / chord;

  const meanAerodynamicChord =
    (2 * chord * (1 + taperRatio + taperRatio * taperRatio)) /
    (3 * (1 + taperRatio));
    
  return { area, aspectRatio, taperRatio, meanAerodynamicChord };
};

export default useWingAerodynamics;