import { useEffect } from "react";
import { useWingStore } from "../stores/useWing";
import { useProfileStore } from "../stores/useProfile";
import { ProfileFactory } from "../utils/wing/ProfileFactory";

const useProfilePoints = () => {
  const profile = useWingStore((state) => state.profile);
  const set = useProfileStore((state) => state.set);

  useEffect(() => {
    const prof = ProfileFactory.create(profile);
    prof.createPoints();
    prof.flatten();

    set({
      prof,
    });
  }, [profile]);
};

export default useProfilePoints;
