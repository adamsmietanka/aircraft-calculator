import { PRESENTATION_MODE } from "../../three/config";
import { useSubtitleStore } from "../stores/useSubtitles";
import useAwaitClick from "./useAwaitClick";

const useSubs = () => {
  const setSub = useSubtitleStore((state) => state.setSub);
  const show = useSubtitleStore((state) => state.show);
  const hide = useSubtitleStore((state) => state.hide);

  const waitUserInput = useAwaitClick();

  const displaySub = async (
    next: any,
    text: string | React.ReactNode,
    duration = 3000,
    showInPresentation = false
  ) => {
    if (!PRESENTATION_MODE || showInPresentation) {
      setSub(text);
      show();
      await next({ delay: duration });
      hide();
      await next({ delay: 1000 });
    } else {
      await waitUserInput();
    }
  };

  const showSub = (text: string | React.ReactNode) => {
    setSub(text);
    show();
  };

  return { displaySub, hideSubs: hide, showSub };
};

export default useSubs;
