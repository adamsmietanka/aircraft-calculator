import { useEffect } from "react";
import { useWingStore } from "../stores/useWing";
import { useProfileStore } from "../stores/useProfile";
import { ProfileFactory } from "../utils/wing/ProfileFactory";

const useProfilePoints = () => {
  const profile = useWingStore((state) => state.profile);
  const setPoints = useProfileStore((state) => state.set);

  useEffect(() => {
    const prof = ProfileFactory.create(profile);
    prof.createPoints();

    const { upper, lower, camber: chord, max } = prof;

    const low = [0];
    const high = [0];

    let sum = 0;
    upper.forEach((p, index, arr) => {
      if (index > 0) {
        const dist = Math.hypot(
          p[0] - arr[index - 1][0],
          p[1] - arr[index - 1][1]
        );
        sum += dist;
        high.push(sum);
      }
    });

    sum = 0;
    lower.forEach((p, index, arr) => {
      if (index > 0) {
        const dist = Math.hypot(
          p[0] - arr[index - 1][0],
          p[1] - arr[index - 1][1]
        );
        sum += dist;
        low.push(sum);
      }
    });

    setPoints({
      profile: [...upper, ...lower.toReversed()],
      upper,
      lower,
      chord,
      upperFlat: high.map((x) => [x, 0.01, 0]),
      lowerFlat: low.map((x) => [x, -0.01, 0]),
      maxThickness: max[1][1] - max[0][1],
      lowestPoint: max[0][1],
      highestPoint: max[1][1],
    });
  }, [profile]);
};

export default useProfilePoints;
