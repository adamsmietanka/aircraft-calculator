import { useEffect } from "react";
import { usePlaneStore } from "../stores/usePlane";
import { usePlaneCoefficientsStore } from "../stores/usePlaneCoefficients";
import { useWingStore } from "../stores/useWing";
import { useWingCoefficientsStore } from "../stores/useWingCoefficients";
import useReversedData from "../../common/hooks/useReversedData";
import { table as profileTable } from "../data/profiles_interpolated";
import { useVerticalStore } from "../stores/useVertical";
import { useHorizontalStore } from "../stores/useHorizontal";
import { linearInterpolation } from "../../../utils/interpolation/binarySearch";

const table: Record<number, { cd: number; area: number }> = {
  2301: { cd: 0.353, area: 0.0153 },
  2302: { cd: 0.266, area: 0.0147 },
  2303: { cd: 0.116, area: 0.0184 },
  2304: { cd: 0.071, area: 0.0167 },
};

const INTERFERENCE = 0.05;
const KSI = 4.5;

const xG = 0.28;
const xA = 0.25;
const cM = -0.05;

const getAlphaFromCl = (monotonic: number[][], k: number[][]) => {
  const [cl0, alpha0] = monotonic[1];
  const [cl1, alpha1] = monotonic[monotonic.length - 2];

  return k.map(([y, x, z]) => [
    linearInterpolation(cl0, alpha0, cl1, alpha1, x),
    y,
    z,
  ]);
};

const usePlaneAerodynamics = () => {
  const wingCl = useWingCoefficientsStore((state) => state.cl);
  const wingCd = useWingCoefficientsStore((state) => state.cd);

  const area = useWingStore((state) => state.area);
  const areaVertical = useVerticalStore((state) => state.area);

  const areaHorizontal = useHorizontalStore((state) => state.area);
  const kH = useHorizontalStore((state) => state.kH);
  const aspectRatio = useHorizontalStore((state) => state.aspectRatio);

  const fuselage = usePlaneStore((state) => state.fuselage);
  const length = usePlaneStore((state) => state.length);
  const configuration = usePlaneStore((state) => state.configuration);
  const setPlane = usePlaneStore((state) => state.set);

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
    const cdVertical = wingCd.map(([y, x, z]) => [getCdVertical(), x, z]);
    const cdFuse = wingCd.map(([y, x, z]) => [getCdFuse(x), x, z]);

    const getClHorizontal = (Cl: number) => (cM + (xG - xA) * Cl) / kH;

    const getCdHorizontal = (Clh: number) => {
      return (
        ((minCd + 0.005 + (Clh * Clh) / (Math.PI * aspectRatio * 0.8)) *
          areaHorizontal) /
        (area * wingNumber)
      );
    };

    const clHorizontal = wingCl.map(([x, y, z]) => [x, getClHorizontal(y), z]);
    const cdHorizontal = wingCd.map(([y, x, z]) => [
      getCdHorizontal(getClHorizontal(x)),
      x,
      z,
    ]);

    const cd = wingCd.map(([y, x, z]) => [
      (y +
        getCdFuse(x) +
        getCdVertical() +
        getCdHorizontal(getClHorizontal(x))) *
        (1 + INTERFERENCE),
      x,
      z,
    ]);

    const cl = wingCl.map(([x, y, z]) => [x, y, z]);

    const { monotonic, reversed } = useReversedData(cl, cd);
    const { monotonic: monotonicHorizontal, reversed: reversedHorizontal } =
      useReversedData(clHorizontal, cdHorizontal);
    const { reversed: reversedFuse } = useReversedData(cl, cdFuse);
    const { reversed: reversedVertical } = useReversedData(cl, cdVertical);

    const k = cd.map(([y, x, z]) => [x / y, x, z]);
    const kAlpha = getAlphaFromCl(monotonic, k);

    const highestK = kAlpha.reduce((previous, current) =>
      current[1] > previous[1] ? current : previous
    );
    setPlane({ kMax: highestK[1], angleOpt: highestK[0] });

    set({
      cl,
      clHorizontal,
      k: kAlpha,
      cd,
      monotonic,
      monotonicHorizontal,
      reversed,
      cdFuse,
      reversedFuse,
      cdVertical,
      cdHorizontal,
      reversedVertical,
      reversedHorizontal,
    });
  }, [fuselage, length, configuration, areaVertical, wingCd, kH]);
};

export default usePlaneAerodynamics;
