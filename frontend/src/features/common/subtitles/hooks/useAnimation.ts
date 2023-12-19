import { useEffect, useRef } from "react";
import useSubs from "./useSubs";
import { useProfileChartsStore } from "../../../aerodynamics/hooks/useProfileCharts";
import { useWingStore } from "../../../aerodynamics/stores/useWing";

const useAnimation = (
  animation: () => void,
  cleanup: () => void,
  setup: () => void,
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
    setup();
    await wait(1500);
    setInAnimation(true);
    try {
      await animation();
    } catch {}
  };

  useEffect(() => {
    if (visible) {
      savedProfile.current = profile;
      savedAngle.current = chart.xHover;
      savedLock.current = chart.locked;

      animationWrapper();
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
