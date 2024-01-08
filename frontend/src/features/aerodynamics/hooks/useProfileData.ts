import { useEffect } from "react";
import { getProfileData } from "../data/profiles_interpolated";
import { useWingStore } from "../stores/useWing";
import useReversedData from "../../common/hooks/useReversedData";
import { useProfileCoefficientsStore } from "../stores/useProfileCoefficients";
import { useProfileTabCoefficientsStore } from "../stores/useProfileTabCoefficients";

const useProfileData = () => {
  const profile = useWingStore((state) => state.profile);
  const reynoldsIndex = useWingStore((state) => state.reynoldsIndex);
  const reynoldsClosest = useWingStore((state) => state.reynoldsClosest);
  const setProfileTab = useProfileTabCoefficientsStore((state) => state.set);
  const set = useProfileCoefficientsStore((state) => state.set);

  useEffect(() => {
    const cl = getProfileData(profile).cz[reynoldsIndex].map(([x, y]) => [
      x,
      y,
      0.1,
    ]);
    const cd = getProfileData(profile).cd[reynoldsIndex].map(([x, y]) => [
      y,
      x,
      0.1,
    ]);
    const { clMonotonic, cdReversed } = useReversedData(cl, cd);
    setProfileTab({ cl, cd, monotonic: clMonotonic, reversed: cdReversed });
  }, [profile, reynoldsIndex]);

  useEffect(() => {
    const cl = getProfileData(profile).cz[reynoldsClosest].map(([x, y]) => [
      x,
      y,
      0.1,
    ]);
    const cd = getProfileData(profile).cd[reynoldsClosest].map(([x, y]) => [
      y,
      x,
      0.1,
    ]);
    const { clMonotonic, cdReversed } = useReversedData(cl, cd);
    set({ cl, cd, monotonic: clMonotonic, reversed: cdReversed });
  }, [profile, reynoldsClosest]);
};

export default useProfileData;
