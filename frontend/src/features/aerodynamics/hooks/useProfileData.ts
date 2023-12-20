import { useMemo } from "react";
import { getProfileData } from "../data/profiles_interpolated";
import { useWingStore } from "../stores/useWing";
import useReversedData from "../../common/hooks/useReversedData";

const useProfileData = (reynoldsIndex: number) => {
  const profile = useWingStore((state) => state.profile);

  const profileCl = useMemo(
    () =>
      getProfileData(profile).cz[reynoldsIndex].map(([x, y]) => [x, y, 0.1]),
    [profile, reynoldsIndex]
  );

  const profileCd = useMemo(
    () =>
      getProfileData(profile).cd[reynoldsIndex].map(([x, y]) => [y, x, 0.1]),
    [profile, reynoldsIndex]
  );

  const { clMonotonic: profileClMonotonic, cdReversed: profileCdReversed } =
    useReversedData(profileCl, profileCd);

  return { profileCl, profileCd, profileClMonotonic, profileCdReversed };
};

export default useProfileData;
