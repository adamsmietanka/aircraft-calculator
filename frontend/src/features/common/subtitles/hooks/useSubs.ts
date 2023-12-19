import { useNavigationStore } from "../../../navigation/useNavigation";
import { useSubtitleStore } from "../stores/useSubtitles";
import useAwaitClick from "./useAwaitClick";

const useSubs = () => {
  const setSub = useSubtitleStore((state) => state.setSub);
  const show = useSubtitleStore((state) => state.show);
  const hide = useSubtitleStore((state) => state.hide);
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
      show();
      await next({ delay: duration });
      hide();
      await next({ delay: 500 });
    } else {
      setSub(text);
      await waitUserInput();
      show();
      await waitUserInput();
      hide();
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

  const subtitle = async (
    text: string | JSX.Element,
    sideEffect = () => {},
    duration = 3000
  ) => {
    if (!useSubtitleStore.getState().inAnimation) throw "done";
    duration *= prolongShorter(subLength(text) / 60);
    if (!presentation) {
      setSub(text);
      show();
      await sideEffect();
      await waitForClick(duration);
      hide();
      await waitForClick(750);
      if (!useSubtitleStore.getState().inAnimation) throw "done";
    } else {
      setSub(text);
      await waitForClick(0);
      show();
      await sideEffect();
      await waitForClick(0);
      hide();
    }
  };

  const showSub = async (text: string | React.ReactNode) => {
    setSub(text);
    presentation && (await waitUserInput());
    show();
  };

  return {
    displaySub,
    hideSubs: hide,
    showSub,
    waitForClick,
    subtitle,
    setInAnimation,
  };
};

export default useSubs;
