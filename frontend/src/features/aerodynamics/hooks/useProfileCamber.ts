import { useWingStore } from "../stores/useWing";

const useProfileCamber = () => {
  const profile = useWingStore((state) => state.profile);

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

export default useProfileCamber;
