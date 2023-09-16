import React, { useEffect } from "react";
import Formula from "./Formula";

declare global {
  interface Window {
    MathJax: any;
  }
}

interface Props {
  name: string;
  hover: boolean;
  tex: string;
  texHover: string;
  center?: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

const HoverableFormula = ({
  name,
  tex,
  texHover,
  center = false,
  onEnter,
  onLeave,
  hover,
}: Props) => {
  useEffect(() => {
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  }, [tex]);

  return (
    <div
      className={`tooltip tooltip-left h-8 flex ${
        center && "items-center"
      }`}
      data-tip={name}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <p className={` ${hover && "hidden"}`}>{`\\(${tex}\\)`}</p>
      <p className={` ${hover || "hidden"}`}>{`\\(${texHover}\\)`}</p>
    </div>
  );
};

export default HoverableFormula;
