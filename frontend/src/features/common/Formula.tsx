import { SpringValues, animated } from "@react-spring/web";
import { useEffect } from "react";

declare global {
  interface Window {
    MathJax: any;
  }
}
interface Props {
  tex?: string;
  className?: string;
  style?: SpringValues<{
    opacity?: number;
    width?: string;
    "font-size"?: string;
    display?: string;
  }>;
}

const Formula = ({ tex = "", className = "", style }: Props) => {
  useEffect(() => {
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  }, [tex]);

  return (
    <animated.p
      className={className}
      style={style}
    >{`\\(${tex}\\)`}</animated.p>
  );
};

export default Formula;
