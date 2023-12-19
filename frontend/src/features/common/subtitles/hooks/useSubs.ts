import { useNavigationStore } from "../../../navigation/useNavigation";
import { useSubtitleStore } from "../stores/useSubtitles";
import useAwaitClick from "./useAwaitClick";

const useSubs = () => {
  const setSub = useSubtitleStore((state) => state.setSub);
  const showSub = useSubtitleStore((state) => state.show);
  const hideSub = useSubtitleStore((state) => state.hide);
  const setInAnimation = useSubtitleStore((state) => state.setInAnimation);

  const presentation = useNavigationStore((state) => state.presentation);

  const { waitUserInput, waitForClick } = useAwaitClick();

  const displaySub = async (
    next: any,
    text: string | React.ReactNode,
    duration = 3000
  ) => {
    if (!presentation) {
      setSub(text);
      showSub();
      await next({ delay: duration });
      hideSub();
      await next({ delay: 500 });
    } else {
      setSub(text);
      await waitUserInput();
      showSub();
      await waitUserInput();
      hideSub();
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

  const sub = async (
    text: string | JSX.Element,
    sideEffect = () => {},
    duration = 3000
  ) => {
    if (!useSubtitleStore.getState().inAnimation) throw "done";
    duration *= prolongShorter(subLength(text) / 100);
    if (!presentation) {
      setSub(text);
      showSub();
      await sideEffect();
      await waitForClick(duration);
      hideSub();
      await waitForClick(750);
      if (!useSubtitleStore.getState().inAnimation) throw "done";
    } else {
      setSub(text);
      await waitForClick(0);
      showSub();
      await sideEffect();
      await waitForClick(0);
      hideSub();
    }
  };

  const show = async (text: string | React.ReactNode) => {
    if (!useSubtitleStore.getState().inAnimation) throw "done";
    setSub(text);
    presentation && (await waitUserInput());
    showSub();
  };

  return {
    displaySub,
    hide: hideSub,
    show,
    waitForClick,
    sub,
    setInAnimation,
  };
};

export default useSubs;
