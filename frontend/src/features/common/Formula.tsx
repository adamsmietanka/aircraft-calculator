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
    fontSize?: string;
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
    marginTop?: string;
    marginRight?: string;
    display?: string;
    color?: string;
  }>;
  phantom?: string;
}

const Formula = ({ tex = "", className = "", style, phantom = "" }: Props) => {
  useEffect(() => {
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  }, [tex]);

  useEffect(() => {
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax = {
        ...window.MathJax,
        loader: { load: ["[tex]/ams", "[tex]/soul"] },
        tex: { packages: { "[+]": ["ams", "soul"] } },
      };
    }
  }, []);

  return (
    <animated.p
      className={className}
      style={style}
    >{`\\(\\vphantom{${phantom}}${tex}\\)`}</animated.p>
  );
};

export default Formula;
