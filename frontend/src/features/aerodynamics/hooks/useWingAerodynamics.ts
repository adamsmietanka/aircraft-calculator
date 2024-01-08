import { useEffect } from "react";
import { getReynolds } from "../data/profiles";
import { useProfileCoefficientsStore } from "../stores/useProfileCoefficients";
import { useWingStore } from "../stores/useWing";
import useProfileTable, { Row } from "./useProfileTable";
import { useWingCoefficientsStore } from "../stores/useWingCoefficients";
import useReversedData from "../../common/hooks/useReversedData";
import { table } from "../data/profiles_interpolated";

const KINEMATIC_VISCOSITY = 1.4207e-5;

const useWingAerodynamics = () => {
  const profile = useWingStore((state) => state.profile);
  const span = useWingStore((state) => state.span);
  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);

  const stallVelocity = useWingStore((state) => state.stallVelocity);
  const material = useWingStore((state) => state.material);

  const shape = useWingStore((state) => state.shape);

  const profileCl = useProfileCoefficientsStore((state) => state.cl);
  const profileCd = useProfileCoefficientsStore((state) => state.cd);

  const setReynoldsIndex = useWingStore((state) => state.setReynoldsIndex);
  const setCoefficients = useWingCoefficientsStore((state) => state.set);
  const set = useWingStore((state) => state.set);

  useEffect(() => {
    const getClosestReynolds = (stallReynolds: number) => {
      const closest = getReynolds(profile).map((re) =>
        Math.abs(stallReynolds - re * 1000000)
      );
      let closestIndex = closest.reduce(
        (index, value, i, array) => (value < array[index] ? i : index),
        0
      );
      // setReynoldsIndex(closestIndex);
      return closestIndex;
    };

    const getArea = () => {
      if (shape === 0) return chord * span;
      if (shape === 1) return ((chord + chordTip) * span) / 2;
      return (Math.PI * chord * span) / 4;
    };

    const getTaper = () => {
      if (shape === 0) return 1;
      if (shape === 1) return chordTip / chord;
      return 0;
    };

    const area = getArea();
    const aspectRatio = (span * span) / area;
    const taperRatio = getTaper();

    const getMAC = () => {
      if (shape === 0) return chord;
      if (shape === 1)
        return (
          (2 * chord * (1 + taperRatio + taperRatio * taperRatio)) /
          (3 * (1 + taperRatio))
        );
      return (8 * chord) / (3 * Math.PI);
    };

    const getMACposition = () => {
      if (shape === 0) return [0, -span / 4];
      if (shape === 1) {
        const tangent = Math.tan((angle * Math.PI) / 180);
        const xMAC =
          (tangent * span * (1 + 2 * taperRatio)) / (6 * (1 + taperRatio));
        const yMAC = -xMAC / tangent;
        return [xMAC, yMAC];
      }
      return [(chord / 2) * (1 - 8 / (3 * Math.PI)), -span / 4];
    };

    const getFirstGlauertCoefficient = () => {
      if (shape === 2) return 0;
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

    const getAlphaInduced = (Cl: number) =>
      ((Cl / (Math.PI * aspectRatio)) * (1 + firstGlauertCoefficient) * 180) /
      Math.PI;

    const getBeta25 = () => {
      const xTip = (Math.tan((angle * Math.PI) / 180) * span) / 2;
      const x = xTip + (chordTip - chord) / 4;
      return (Math.atan((2 * x) / span) * 180) / Math.PI;
    };

    const getSecondGlauertCoefficient = () => {
      if (shape === 2) return 0;
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
      const coeff = (delta1 * delta2 * delta3) / 0.048;
      return coeff >= 0 ? coeff : 0;
    };

    const MAC = getMAC();
    const MACposition = getMACposition();

    const stallReynolds = (stallVelocity * MAC) / KINEMATIC_VISCOSITY;

    const closestIndex = 1; //getClosestReynolds(stallReynolds);

    const { maxCz, CdOfZeroCl, slope } = table[profile][closestIndex];

    const Cxmin2 = CdOfZeroCl * Math.pow(stallReynolds / 1e7, 0.11);
    const deltaCxRe = (Cz: number) =>
      (Cxmin2 - CdOfZeroCl) * (1 - Math.abs(Cz / maxCz));

    const CdMaterial = CdOfZeroCl * (material ? 0.15 : 0.5);

    const firstGlauertCoefficient = getFirstGlauertCoefficient();
    const secondGlauertCoefficient = getSecondGlauertCoefficient();

    const getCdInduced = (Cl: number) =>
      ((Cl * Cl) / (Math.PI * aspectRatio)) * (1 + secondGlauertCoefficient);

    const getCdWing = (Cl: number, Cd: number) => {
      return Cd + deltaCxRe(Cl) + CdMaterial + getCdInduced(Cl);
    };
    const cl = profileCl.map(([x, y, z]) => [x + getAlphaInduced(y), y, z]);
    const cd = profileCd.map(([y, x, z]) => [getCdWing(x, y), x, z]);
    const cdInduced = profileCd.map(([y, x, z]) => [getCdInduced(x), x, z]);
    const { clMonotonic, cdReversed } = useReversedData(cl, cd);
    const { cdReversed: reversedInduced } = useReversedData(cl, cdInduced);

    set({
      area,
      aspectRatio,
      taperRatio,
      MAC,
      MACposition,
      stallReynolds,
    });

    setCoefficients({
      cl,
      cd,
      monotonic: clMonotonic,
      reversed: cdReversed,
      cdInduced,
      reversedInduced,
    });
  }, [span, chord, chordTip, angle, stallVelocity, material, shape, profileCl]);
};

export default useWingAerodynamics;
