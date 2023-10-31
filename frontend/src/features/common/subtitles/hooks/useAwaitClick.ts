import { useEffect, useRef } from "react";
import { useAwaitClickStore } from "../stores/useAwaitClick";
import { PRESENTATION_MODE } from "../../three/config";
import timeout from "../../utils/timeout";

const useAwaitClick = () => {
  const next = useAwaitClickStore((state) => state.next);
  const wait = useAwaitClickStore((state) => state.wait);

  const localNext = useRef(false);
  const localWait = useRef(false);

  async function waitUserInput() {
    if (PRESENTATION_MODE) {
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
