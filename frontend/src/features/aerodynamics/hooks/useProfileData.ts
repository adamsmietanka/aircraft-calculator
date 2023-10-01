import { useMemo } from "react";
import { getProfileData } from "../data/profiles_interpolated";
import { useWingStore } from "../stores/useWing";
import useReversedData from "../../common/hooks/useReversedData";

const useProfileData = (reynoldsIndex: number) => {
  const profile = useWingStore((state) => state.profile);

  const pointsCl = useMemo(
    () =>
      getProfileData(profile).cz[reynoldsIndex].map(([x, y]) => [x, y, 0.1]),
    [profile, reynoldsIndex]
  );

  const pointsCd = useMemo(
    () =>
      getProfileData(profile).cd[reynoldsIndex].map(([x, y]) => [y, x, 0.1]),
    [profile, reynoldsIndex]
  );

  const { clMonotonic: pointsClMonotonic, cdReversed: pointsCdReversed } =
    useReversedData(pointsCl, pointsCd);

  return { pointsCl, pointsCd, pointsClMonotonic, pointsCdReversed };
};

export default useProfileData;
