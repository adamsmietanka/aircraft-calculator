import { useEffect } from "react";
import { usePlaneStore } from "../stores/usePlane";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import { useWingStore } from "../stores/useWing";
import { useWingCoefficientsStore } from "../stores/useWingCoefficients";
import useReversedData from "../../common/hooks/useReversedData";
import { table as profileTable } from "../data/profiles_interpolated";
import { useVerticalStore } from "../stores/useVertical";

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
  const areaVertical = useVerticalStore((state) => state.area);

  const fuselage = usePlaneStore((state) => state.fuselage);
  const length = usePlaneStore((state) => state.length);
  const configuration = usePlaneStore((state) => state.configuration);

  const set = usePlaneCoefficientsStore((state) => state.set);

  const { minCd } = profileTable["0009"][1];

  useEffect(() => {
    const wingNumber = configuration === 0 || configuration === 2 ? 1 : 2;
    const fuseNumber = configuration === 0 || configuration === 1 ? 1 : 2;
    
    const getCdFuse = (Cl: number) => {
      const fuseArea = length * length * table[fuselage].area * fuseNumber;

      const cdParasitic = (table[fuselage].cd * fuseArea) / (area * wingNumber);
      return cdParasitic * (1 + Math.abs(Cl) / KSI);
    };

    const getCdVertical = () =>
      ((minCd + 0.005) * areaVertical * fuseNumber) / (area * wingNumber);

    const cl = wingCl;
    const cdVertical = wingCd.map(([y, x, z]) => [getCdVertical(), x, z]);
    const cdFuse = wingCd.map(([y, x, z]) => [getCdFuse(x), x, z]);

    const cd = wingCd.map(([y, x, z]) => [
      (y + getCdFuse(x)) * (1 + INTERFERENCE),
      x,
      z,
    ]);

    const { monotonic, reversed } = useReversedData(cl, cd);
    const { reversed: reversedFuse } = useReversedData(cl, cdFuse);
    const { reversed: reversedVertical } = useReversedData(cl, cdVertical);

    set({
      cl,
      cd,
      monotonic,
      reversed,
      cdFuse,
      reversedFuse,
      cdVertical,
      reversedVertical,
    });
  }, [fuselage, length, configuration, areaVertical, wingCd]);
};

export default usePlaneAerodynamics;
