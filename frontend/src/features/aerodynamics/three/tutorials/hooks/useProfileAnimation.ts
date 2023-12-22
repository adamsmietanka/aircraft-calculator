import useAnimation from "../../../../common/subtitles/hooks/useAnimation";
import useSubs from "../../../../common/subtitles/hooks/useSubs";
import { useSubtitleStore } from "../../../../common/subtitles/stores/useSubtitles";
import { useNavigationStore } from "../../../../navigation/useNavigation";
import { useProfileChartsStore } from "../../../hooks/useProfileCharts";
import { useHoverProfileStore } from "../../../stores/useHoverProfile";
import { useWingStore } from "../../../stores/useWing";
import { useLevelFlightStore } from "../stores/useLevelFlight";

/**
 * Used for animating the Profile view in Presentation mode
 * @param visible true when Profile is the current view
 */
const useProfileAnimation = (visible: boolean) => {
  const setReynolds = useWingStore((state) => state.setReynolds);
  const presentation = useNavigationStore((state) => state.presentation);
  const setAnimation = useSubtitleStore((state) => state.set);

  const { waitForClick: wait } = useSubs();
  const setFormula = useLevelFlightStore((state) => state.set);
  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);

  const setProfile = useWingStore((state) => state.setProfile);

  const interpolate = (start: number, end: number, ratio: number) =>
    start + (end - start) * ratio;

  const animation = async () => {
    await wait(0);
    await wait(0);
    setAnimation({ slowdown: true });
    setChart({ hover: true });
    setProfile("4412");
    await wait(0);
    setProfile("2412");
    await wait(2000);
    setChart({ locked: "" });
    await wait(500);
    setChart({
      yHover: useProfileChartsStore.getState().y["Coefficient of Lift"],
      locked: "Coefficient of Drag",
    });
    setProfile("4412");

    // stall
    await wait(0);
    setProfile("2412");
    await wait(2000);
    setChart({
      xHover: interpolate(useProfileChartsStore.getState().xHover, 15.8, 0.66),
      locked: "",
    });
    await wait(2000);
    setChart({
      xHover: interpolate(useProfileChartsStore.getState().xHover, 15.8, 0.66),
    });
    await wait(2000);
    setChart({
      xHover: 15.8,
    });
    await wait(0);
    setChart({ xHover: 19 });

    // symmetrical airfoil
    await wait(0);
    setAnimation({ slowdown: false, duration: 2 });
    setProfile("0009");
    await wait(100);
    setChart({ xHover: 10 });
    await wait(0);
    setChart({ xHover: 0 });
    await wait(0);
    setChart({ xHover: -5 });
    await wait(1500);
    setChart({ xHover: 5 });
    await wait(1500);
    setChart({ xHover: 0 });
    await wait(0);
    setProfile("2412");
    setChart({
      yHover: 1.7,
      locked: "Coefficient of Drag",
    });
    await wait(0);
  };

  const cleanup = () => {
    set({ showWeight: false, mass: 0.5, speed: 1 });
    setFormula({ show: false, expand: false, rearrange: false });
  };

  presentation && useAnimation(animation, cleanup, () => {}, visible);
};

export default useProfileAnimation;
