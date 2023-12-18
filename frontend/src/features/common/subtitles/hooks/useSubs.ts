import { useNavigationStore } from "../../../navigation/useNavigation";
import { useSubtitleStore } from "../stores/useSubtitles";
import useAwaitClick from "./useAwaitClick";

const useSubs = () => {
  const setSub = useSubtitleStore((state) => state.setSub);
  const show = useSubtitleStore((state) => state.show);
  const hide = useSubtitleStore((state) => state.hide);
  const inAnimation = useSubtitleStore((state) => state.inAnimation);
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
    return text.props.children.reduce(
      (acc: number, val: string | JSX.Element) =>
        typeof val === "string"
          ? acc + val.length
          : acc + val.props.tex.length / 2,
      0
    );
  };

  const subtitle = async (text: string | JSX.Element, duration = 3000) => {
    console.log(inAnimation);
    if (!useSubtitleStore.getState().inAnimation) throw Error();
    duration *= subLength(text) / 80;
    if (!presentation) {
      setSub(text);
      show();
      await waitForClick(duration);
      hide();
      await waitForClick(1000);
      if (!useSubtitleStore.getState().inAnimation) throw Error();
    } else {
      setSub(text);
      await waitForClick(0);
      show();
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
