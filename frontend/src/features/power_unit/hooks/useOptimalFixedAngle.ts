import { useMemo } from "react";
import { barycentricJ } from "../../../utils/interpolation/binarySearch";
import { usePropellerStore } from "../stores/usePropeller";
import { cp } from "../data/cp";
import { useCp } from "./useCp";

export const useOptimalFixedAngle = () => {
  const { Cp } = useCp();
  const blades = usePropellerStore((state) => state.blades);
  const angle = usePropellerStore((state) => state.angle);

  const cpMesh = useMemo(() => cp[blades], [blades]);

  const j_lim = barycentricJ(cpMesh, angle, Cp);

  return { j_lim };
};
