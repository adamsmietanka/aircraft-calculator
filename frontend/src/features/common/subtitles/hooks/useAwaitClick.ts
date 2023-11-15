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

  useEffect(() => {
    if (localWait.current && next) localNext.current = next;
  }, [next]);
  return waitUserInput;
};

export default useAwaitClick;
