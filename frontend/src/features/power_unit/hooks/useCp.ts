import { useEngineStore } from "../stores/useEngine";
import { usePropellerStore } from "../stores/usePropeller";
import { useResultsStore } from "../stores/useResults";
import { usePower } from "./usePower";

export const useCp = () => {
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);

  const diameter = usePropellerStore((state) => state.diameter);

  const altitude = useResultsStore((state) => state.altitude);

  const [calculatePower] = usePower();
  const power = calculatePower(altitude);
  const density = 1.2255 * (1 - altitude / 44.3) ** 4.256;
  const propellerSpeed = (engineSpeed * reductionRatio) / 60;
  const Cp = (power * 1000) / (density * propellerSpeed ** 3 * diameter ** 5);
  
  return { power, propellerSpeed, Cp };
};
