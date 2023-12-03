import { useNavigationStore } from "../../../navigation/useNavigation";
import { useSubtitleStore } from "../stores/useSubtitles";
import useAwaitClick from "./useAwaitClick";

const useSubs = () => {
  const setSub = useSubtitleStore((state) => state.setSub);
  const show = useSubtitleStore((state) => state.show);
  const hide = useSubtitleStore((state) => state.hide);

  const presentation = useNavigationStore((state) => state.presentation);

  const waitUserInput = useAwaitClick();

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
      await next({ delay: 1000 });
    } else {
      setSub(text);
      await waitUserInput();
      show();
      await waitUserInput();
      hide();
    }
  };

  const showSub = async (text: string | React.ReactNode) => {
    setSub(text);
    presentation && await waitUserInput();
    show();
  };

  return { displaySub, hideSubs: hide, showSub };
};

export default useSubs;
