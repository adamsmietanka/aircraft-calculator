import { useMemo } from "react";
import profiles from "../data/profiles_interpolated";
import { useWingStore } from "../stores/useWing";

const useProfileData = (reynoldsIndex: number) => {
  const profile = useWingStore((state) => state.profile);

  const pointsCl = useMemo(
    () => profiles[profile].cz[reynoldsIndex].map(([x, y]) => [x, y, 0.1]),
    [profile, reynoldsIndex]
  );

  const pointsClMonotonic = useMemo(() => {
    const lowest = pointsCl.reduce((previous, current) =>
      current[1] < previous[1] ? current : previous
    );
    const highest = pointsCl.reduce((previous, current) =>
      current[1] > previous[1] ? current : previous
    );

    return pointsCl
      .filter((p) => lowest[0] < p[0] && p[0] < highest[0])
      .map((p) => [p[1], p[0], p[2]]);
  }, [pointsCl]);

  const pointsCd = useMemo(
    () => profiles[profile].cd[reynoldsIndex].map(([x, y]) => [y, x, 0.1]),
    [profile, reynoldsIndex]
  );

  const pointsCdReversed = useMemo(
    () => pointsCd.map(([y, x]) => [x, y, 0]),
    [pointsCd]
  );
  return { pointsCl, pointsCd, pointsClMonotonic, pointsCdReversed };
};

export default useProfileData;
