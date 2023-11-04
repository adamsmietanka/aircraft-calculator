import { usePlaneStore } from "../stores/usePlane";
import useWingAerodynamics from "./useWingAerodynamics";

const usePlaneAerodynamics = () => {
  const { area, wingCl, wingCd } = useWingAerodynamics();
  const configuration = usePlaneStore((state) => state.configuration);

  const interference = 0.05;

  const getCdFuse = (Cl: number) => {
    const cdFuse = 0.116;
    const fuseArea = 6 * (configuration === 0 || configuration === 1 ? 1 : 2);
    const cdParasitic = (cdFuse * fuseArea) / area;
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
