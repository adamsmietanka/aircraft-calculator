import { useWingStore } from "../stores/useWing";
import getNACA4series from "./getNACA4series";
import getProfileFlat from "./getProfileFlat";

const getProfileDetails = (profile: string) => {
  if (profile.length === 2)
    return {
      M: 0,
      P: 0,
      T: parseInt(profile) / 100,
      // max thickness position
      F: 0.3,
    };

  return {
    M: parseInt(profile[0]) / 100,
    P: parseInt(profile[1]) / 10,
    T: parseInt(profile.slice(2, 4)) / 100,
    // max thickness position
    F: 0.3,
  };
};

const getProfilePoints = (profile: string) => {
  const { M, P, T, F } = getProfileDetails(profile);
  const { upper, lower } =
    profile.length === 2 ? getProfileFlat(T) : getNACA4series(M, P, T, F);

  return [...upper, ...lower.toReversed()];
};

export default getProfilePoints;
