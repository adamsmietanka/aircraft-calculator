import { usePlaneStore } from "../stores/usePlane";
import useWingAerodynamics from "./useWingAerodynamics";

const table: Record<number, { cd: number; area: number }> = {
  2302: { cd: 0.266, area: 0.0147 },
  2303: { cd: 0.116, area: 0.0167 },
  2304: { cd: 0.071, area: 0.0167 },
};

const usePlaneAerodynamics = () => {
  const { area, wingCl, wingCd } = useWingAerodynamics();

  const fuselage = usePlaneStore((state) => state.fuselage);
  const length = usePlaneStore((state) => state.length);
  const configuration = usePlaneStore((state) => state.configuration);

  const interference = 0.05;

  const getCdFuse = (Cl: number) => {
    const cdFuse = 0.116;
    const wingArea =
      (configuration === 0 || configuration === 2 ? 1 : 2) * area;
    const fuseArea =
      length *
      length *
      table[fuselage].area *
      (configuration === 0 || configuration === 1 ? 1 : 2);
    const cdParasitic = (table[fuselage].cd * fuseArea) / wingArea;
    const ksi = 4.5;
    return cdParasitic * (1 + Math.abs(Cl) / ksi);
  };

  return {
    wingCd,
    cl: wingCl,
    fuseCd: wingCd.map(([y, x, z]) => [getCdFuse(x), x, z]),
    cd: wingCd.map(([y, x, z]) => [
      (y + getCdFuse(x)) * (1 + interference),
      x,
      z,
    ]),
  };
};

export default usePlaneAerodynamics;
