import { useEffect, useRef } from "react";
import useSubs from "./useSubs";
import { useProfileChartsStore } from "../../../aerodynamics/hooks/useProfileCharts";
import { useWingStore } from "../../../aerodynamics/stores/useWing";

const useAnimation = (
  animation: () => void,
  cleanup: () => void,
  visible: boolean
) => {
  const chart = useProfileChartsStore();
  const profile = useWingStore((state) => state.profile);
  const { hideSubs, waitForClick: wait, subtitle, setInAnimation } = useSubs();
  const setChart = useProfileChartsStore((state) => state.set);
  const setProfile = useWingStore((state) => state.setProfile);

  const savedProfile = useRef("");
  const savedAngle = useRef(0);
  const savedLock = useRef<string | boolean>("");

  const animationWrapper = async () => {
    await wait(1500);
    setInAnimation(true);
    animation();
  };

  useEffect(() => {
    if (visible) {
      savedProfile.current = profile;
      savedAngle.current = chart.xHover;
      savedLock.current = chart.locked;

      try {
        animationWrapper();
      } catch {}
    } else {
      setInAnimation(false);
      hideSubs();
      cleanup();
      setChart({
        hover: false,
        xHover: savedAngle.current,
        locked: savedLock.current,
      });
      setProfile(savedProfile.current ? savedProfile.current : profile);
    }
  }, [visible]);
};

export default useAnimation;