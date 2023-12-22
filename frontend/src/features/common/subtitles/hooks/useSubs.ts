import { useNavigationStore } from "../../../navigation/useNavigation";
import timeout from "../../utils/timeout";
import { useAnimationStore } from "../stores/useAnimation";

const useSubs = () => {
  const setSub = useAnimationStore((state) => state.setSub);
  const showSub = useAnimationStore((state) => state.show);
  const hideSub = useAnimationStore((state) => state.hide);
  const setInAnimation = useAnimationStore((state) => state.setInAnimation);

  const presentation = useNavigationStore((state) => state.presentation);

  /**
   * Wait until some time has passed or user has clicked
   * @param duration the time (ms) to wait, 0 - wait for click indefinitely
   */
  const pause = async (duration = 500) => {
    const start = useAnimationStore.getState().counter;
    if (duration === 0) {
      if (!useAnimationStore.getState().inAnimation) throw "done";
      while (start === useAnimationStore.getState().counter) await timeout(50);
    } else {
      for (let i = 0; i < duration / 50; i++) {
        await timeout(50);
        if (start !== useAnimationStore.getState().counter) break;
      }
    }
  };

  const subLength = (text: string | JSX.Element) => {
    if (typeof text === "string") return text.length;
    const { children } = text.props;
    if (typeof children === "string") return children.length;
    return text.props.children.reduce(
      (acc: number, val: string | JSX.Element) =>
        typeof val === "string"
          ? acc + val.length
          : acc + (val.props.tex?.length / 2 || val.props.children?.length),
      0
    );
  };

  const prolongShorter = (scale: number) =>
    scale < 1 ? Math.pow(scale, 0.4) : scale;

  /**
   * Display a subtitle inside of an animation
   * @param text string or JSX to be displayed
   * @param sideEffect function called just after the sub is shown
   * @param duration used when the sideEffects are too long, otherwise let subLength do the lifting
   */
  const sub = async (
    text: string | JSX.Element,
    sideEffect = () => {},
    duration = 3000
  ) => {
    if (!useAnimationStore.getState().inAnimation) throw "done";
    duration *= prolongShorter(subLength(text) / 100);
    if (!presentation) {
      setSub(text);
      showSub();
      await sideEffect();
      await pause(duration);
      hideSub();
      await pause(750);
      if (!useAnimationStore.getState().inAnimation) throw "done";
    } else {
      setSub(text);
      await pause(0);
      showSub();
      await sideEffect();
      await pause(0);
      hideSub();
    }
  };

  /**
   * Straight up show the text, no added logic. Remember to hide it manually!
   * @param text string or JSX to be displayed
   */
  const show = async (text: string | React.ReactNode) => {
    if (!useAnimationStore.getState().inAnimation) throw "done";
    setSub(text);
    presentation && (await pause(0));
    showSub();
  };

  return {
    hide: hideSub,
    show,
    pause: pause,
    sub,
    setInAnimation,
  };
};

export default useSubs;
