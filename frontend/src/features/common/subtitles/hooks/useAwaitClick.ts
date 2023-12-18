import { useEffect, useRef } from "react";
import { useAwaitClickStore } from "../stores/useAwaitClick";
import timeout from "../../utils/timeout";
import { useNavigationStore } from "../../../navigation/useNavigation";

const useAwaitClick = () => {
  const next = useAwaitClickStore((state) => state.next);
  const wait = useAwaitClickStore((state) => state.wait);

  const presentation = useNavigationStore((state) => state.presentation);

  const localNext = useRef(false);
  const localWait = useRef(false);

  async function waitUserInput() {
    if (presentation) {
      localWait.current = true;
      wait();
      while (localNext.current === false) await timeout(50); // pauses script
      wait(); // reset var
      localNext.current = false;
      localWait.current = false;
    }
  }

  async function waitForClick(duration = 500) {
    const start = useAwaitClickStore.getState().counter;
    if (duration === 0) {
      while (start === useAwaitClickStore.getState().counter) await timeout(50);
    } else {
      for (let i = 0; i < duration / 50; i++) {
        await timeout(50);
        if (start !== useAwaitClickStore.getState().counter) break;
      }
    }
  }

  useEffect(() => {
    if (localWait.current && next) localNext.current = next;
  }, [next]);
  return { waitUserInput, waitForClick };
};

export default useAwaitClick;
