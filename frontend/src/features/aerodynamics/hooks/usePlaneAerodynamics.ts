import { useEffect } from "react";
import { usePlaneStore } from "../stores/usePlane";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import { useWingStore } from "../stores/useWing";
import { useWingCoefficientsStore } from "../stores/useWingCoefficients";
import useReversedData from "../../common/hooks/useReversedData";

const table: Record<number, { cd: number; area: number }> = {
  2301: { cd: 0.353, area: 0.0153 },
  2302: { cd: 0.266, area: 0.0147 },
  2303: { cd: 0.116, area: 0.0184 },
  2304: { cd: 0.071, area: 0.0167 },
};

const INTERFERENCE = 0.05;
const KSI = 4.5;

const usePlaneAerodynamics = () => {
  const wingCl = useWingCoefficientsStore((state) => state.cl);
  const wingCd = useWingCoefficientsStore((state) => state.cd);

  const area = useWingStore((state) => state.area);

  const fuselage = usePlaneStore((state) => state.fuselage);
  const length = usePlaneStore((state) => state.length);
  const configuration = usePlaneStore((state) => state.configuration);

  const set = usePlaneCoefficientsStore((state) => state.set);

  useEffect(() => {
    const getCdFuse = (Cl: number) => {
      const isBiplane = configuration === 0 || configuration === 2;
      const isMultifuse = configuration === 0 || configuration === 1;

      const wingArea = (isBiplane ? 1 : 2) * area;
      const fuseArea =
        length * length * table[fuselage].area * (isMultifuse ? 1 : 2);

      const cdParasitic = (table[fuselage].cd * fuseArea) / wingArea;
      return cdParasitic * (1 + Math.abs(Cl) / KSI);
    };

    const cl = wingCl;
    const cd = wingCd.map(([y, x, z]) => [
      (y + getCdFuse(x)) * (1 + INTERFERENCE),
      x,
      z,
    ]);
    const cdFuse = wingCd.map(([y, x, z]) => [getCdFuse(x), x, z]);

    const { monotonic, reversed } = useReversedData(cl, cd);
    const { reversed: reversedFuse } = useReversedData(cl, cdFuse);

    set({ cl, cd, monotonic, reversed, cdFuse, reversedFuse });
  }, [fuselage, length, configuration, wingCd]);
};

export default usePlaneAerodynamics;
