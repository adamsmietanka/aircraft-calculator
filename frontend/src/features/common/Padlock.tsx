import React, { useEffect, useRef } from "react";
import { ReactComponent as PadlockIcon } from "../../assets/padlock.svg";

interface Props {
  locked: boolean;
  setLocked: (value: boolean) => void;
}

const Padlock = ({ locked, setLocked }: Props) => {
  const lockRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const element = lockRef.current;
    if (element) {
      locked
        ? element.classList.add("locked")
        : element.classList.remove("locked");
    }
  }, [locked]);

  return (
    <span className="cursor-pointer" onClick={() => setLocked(!locked)}>
      <div
        className="tooltip  w-6 svg-color text-color z-50"
        data-tip="Locking makes the value computed from the graph. Unlocking enables manual input"
      >
        <PadlockIcon ref={lockRef} />
      </div>
    </span>
  );
};

export default Padlock;
