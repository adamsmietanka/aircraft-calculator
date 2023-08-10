import { useEffect } from "react";

declare global {
  interface Window {
    MathJax: any;
  }
}

const Formula = ({ tex = "" }) => {
  useEffect(() => {
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  }, [tex]);

  return <p>{`\\(${tex}\\)`}</p>;
};

export default Formula;
