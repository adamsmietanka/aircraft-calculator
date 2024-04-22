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
    const profileFix =
      profile.length === 5
        ? profile.substring(0, 2) + "0" + profile.substring(3)
        : profile;
    const cl = getProfileData(profileFix).cz[reynoldsIndex].map(([x, y]) => [
      x,
      y,
      0.1,
    ]);
    const cd = getProfileData(profileFix).cd[reynoldsIndex].map(([x, y]) => [
      y,
      x,
      0.1,
    ]);
    const { monotonic, reversed } = useReversedData(cl, cd);
    setProfileTab({ cl, cd, monotonic, reversed });
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
    const { monotonic, reversed } = useReversedData(cl, cd);
    set({ cl, cd, monotonic, reversed });
  }, [profile, reynoldsClosest]);
};

export default useProfileData;
