import useAnimation from "../../../../common/subtitles/hooks/useAnimation";
import useSubs from "../../../../common/subtitles/hooks/useSubs";
import { useAnimationStore } from "../../../../common/subtitles/stores/useAnimation";
import { useNavigationStore } from "../../../../navigation/useNavigation";
import { useProfileChartsStore } from "../../../hooks/useProfileCharts";
import { useHoverProfileStore } from "../../../stores/useHoverProfile";
import { useWingStore } from "../../../stores/useWing";

/**
 * Used for animating the Profile view in Presentation mode
 * @param visible true when Profile is the current view
 */
const useProfileAnimation = (visible: boolean) => {
  const setReynoldsIndex = useWingStore((state) => state.setReynoldsIndex);
  const presentation = useNavigationStore((state) => state.presentation);
  const setAnimation = useAnimationStore((state) => state.set);

  const { pause } = useSubs();
  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);

  const setProfile = useWingStore((state) => state.setProfile);

  const interpolate = (start: number, end: number, ratio: number) =>
    start + (end - start) * ratio;

  const animation = async () => {
    await pause(0);
    await pause(0);
    await pause(500);
    setAnimation({ slowdown: true });
    // manually set to 4412
    await pause(0);
    setChart({ hover: true });
    await pause(0);
    setProfile("2412");
    await pause(2000);
    setChart({ locked: "" });
    await pause(500);
    setChart({
      yHover: useProfileChartsStore.getState().y["Coefficient of Lift"],
      locked: "Coefficient of Drag",
    });
    setProfile("4412");

    // stall
    await pause(0);
    setProfile("2412");
    await pause(2000);
    setChart({
      xHover: interpolate(useProfileChartsStore.getState().xHover, 15.8, 0.66),
      locked: "",
    });
    await pause(2000);
    setChart({
      xHover: interpolate(useProfileChartsStore.getState().xHover, 15.8, 0.66),
    });
    await pause(2000);
    setChart({
      xHover: 15.8,
    });
    await pause(0);
    setChart({ xHover: 18 });
    await pause(0);
    setAnimation({ duration: 1 });
    set({ dragMultiplier: 1 });
    await pause(1200);
    set({ dragMultiplier: 10 });

    // symmetrical airfoil
    await pause(0);
    setAnimation({ slowdown: false, duration: 2 });
    setProfile("0009");
    await pause(100);
    setChart({ xHover: 10 });
    await pause(0);
    setChart({ xHover: 0 });
    await pause(0);
    setChart({ xHover: -5 });
    await pause(1000);
    setChart({ xHover: 5 });
    await pause(1000);
    setChart({ xHover: 0 });

    // reynolds
    await pause(0);
    setProfile("2412");
    await pause(100);
    setChart({ yHover: 1.7 });
    await pause(1000);
    setAnimation({ slowdown: true });
    // manually Re = 3
    await pause(0);
    await pause(0);
    setReynoldsIndex(1);
    await pause(0);
    setReynoldsIndex(2);

    // other profiles
    await pause(0);
    setAnimation({ slowdown: false });
    setProfile("1408");
    await pause(0);
    setProfile("2421");
    await pause(0);
    setProfile("09");
    await pause(0);
    setProfile("30");
    await pause(0);
    setProfile("2412");
    setReynoldsIndex(1);
  };

  const cleanup = () => {
    setAnimation({ slowdown: false, duration: 2 });
  };

  presentation && useAnimation(animation, cleanup, () => {}, visible);
};

export default useProfileAnimation;
