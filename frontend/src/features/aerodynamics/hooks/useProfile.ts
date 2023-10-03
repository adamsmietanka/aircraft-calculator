import { useEffect, useState } from "react";
import { useWingStore } from "../stores/useWing";
import useNACA4series from "./useNACA4series";
import useProfileFlat from "./useProfileFlat";

export const useProfileCamber = () => {
  const profile = useWingStore((state) => state.profile);

  if (profile.length === 2)
    return {
      M: 0,
      P: 0,
      T: parseInt(profile) / 100,
      // max thickness position
      F: 1,
    };

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
  const [maxThickness, setMaxThickness] = useState(0);
  const [lowestPoint, setLowestPoint] = useState(0);
  const [highestPoint, setHighestPoint] = useState(0);

  const { M, P, T, F } = useProfileCamber();

  useEffect(() => {
    if (profile.length === 2) {
      const { upper, lower, chord, max } = useProfileFlat(T);

      setUpperPoints(upper);
      setLowerPoints(lower);
      setProfilePoints([...upper, ...lower.toReversed()]);
      setChordPoints(chord);
      setMaxThickness(max[1][1] - max[0][1]);
      setLowestPoint(max[0][1]);
      setHighestPoint(max[1][1]);
    } else {
      const { upper, lower, chord, max } = useNACA4series(M, P, T, F);

      setUpperPoints(upper);
      setLowerPoints(lower);
      setProfilePoints([...upper, ...lower.toReversed()]);
      setChordPoints(chord);
      setMaxThickness(max[1][1] - max[0][1]);
      setLowestPoint(max[0][1]);
      setHighestPoint(max[1][1]);
    }
  }, [profile]);

  return {
    profilePoints,
    upperPoints,
    lowerPoints,
    chordPoints,
    maxThickness,
    lowestPoint,
    highestPoint,
  };
};

export default useProfile;
