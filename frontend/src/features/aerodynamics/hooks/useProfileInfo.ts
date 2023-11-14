import { useWingStore } from "../stores/useWing";
import { table } from "../data/profiles_interpolated";

const useProfileInfo = () => {
  const profile = useWingStore((state) => state.profile);
  const reynoldsIndex = useWingStore((state) => state.reynoldsIndex);
  return table.hasOwnProperty(profile)
    ? table[profile][reynoldsIndex]
    : table.default[reynoldsIndex];
};

export default useProfileInfo;
