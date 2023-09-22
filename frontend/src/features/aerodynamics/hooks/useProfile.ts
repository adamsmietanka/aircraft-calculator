import { useEffect, useState } from "react";
import { NUMBER_OF_AIRFOIL_POINTS } from "../../common/three/config";
import { useWingStore } from "../stores/useWing";

export const useProfileCamber = () => {
  const profile = useWingStore((state) => state.profile);

  return {
    M: parseInt(profile[0]) / 100,
    P: parseInt(profile[1]) / 10,
    T: parseInt(profile.slice(2, 4)) / 100,
    // max thickness position
    F: 0.3,
  };
};

const useProfile = () => {
  const profile = useWingStore((state) => state.profile);

  const [profilePoints, setProfilePoints] = useState<number[][]>([]);
  const [upperPoints, setUpperPoints] = useState<number[][]>([]);
  const [lowerPoints, setLowerPoints] = useState<number[][]>([]);
  const [chordPoints, setChordPoints] = useState<number[][]>([]);

  const { M, P, T } = useProfileCamber();

  const getCamberY = (x: number) => {
    if (x < P) {
      return (M / Math.pow(P, 2)) * (2 * P * x - x * x);
    }
    return (M / Math.pow(1 - P, 2)) * (1 - 2 * P + 2 * P * x - x * x);
  };

  const getCamberGradient = (x: number) => {
    if (x < P) {
      return ((2 * M) / Math.pow(P, 2)) * (P - x);
    }
    return ((2 * M) / Math.pow(1 - P, 2)) * (P - x);
  };

  const getThickness = (x: number) => {
    return (
      5 *
      T *
      (0.2969 * Math.pow(x, 0.5) -
        0.126 * x -
        0.3516 * Math.pow(x, 2) +
        0.2843 * Math.pow(x, 3) -
        0.1036 * Math.pow(x, 4))
    );
  };

  const cosineSpacing = (x: number) => (1 - Math.cos(x * Math.PI)) / 2;

  useEffect(() => {
    let upper = [];
    let lower = [];
    let chord = [];

    for (let i = 0; i <= NUMBER_OF_AIRFOIL_POINTS; i++) {
      const x = cosineSpacing(i / NUMBER_OF_AIRFOIL_POINTS);
      const theta = Math.atan(getCamberGradient(x));
      const halfThickness = getThickness(x);
      const y = getCamberY(x);

      upper.push([
        x - halfThickness * Math.sin(theta),
        y + halfThickness * Math.cos(theta),
        0,
      ]);
      lower.push([
        x + halfThickness * Math.sin(theta),
        y - halfThickness * Math.cos(theta),
        0,
      ]);
      chord.push([x, y, 0]);
    }

    setUpperPoints(upper);
    setLowerPoints(lower);
    setProfilePoints([...upper, ...lower.toReversed()]);
    setChordPoints(chord);
  }, [profile]);

  return {
    profilePoints,
    upperPoints,
    lowerPoints,
    chordPoints,
    yCamber: getCamberY(0.25),
  };
};

export default useProfile;
