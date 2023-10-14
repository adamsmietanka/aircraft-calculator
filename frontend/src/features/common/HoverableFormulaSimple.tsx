import { useEffect, useState } from "react";

interface Props {
  className?: string;
  name: string;
  tex: string;
  texHover?: string;
  center?: boolean;
}

const HoverableFormulaSimple = ({
  className = "",
  name,
  tex,
  texHover,
  center = true,
}: Props) => {
  const [hover, setHover] = useState(false);
  
  useEffect(() => {
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  }, [tex]);

  return (
    <div
      className={`tooltip flex justify-center ${center || "items-left"} ` + className}
      data-tip={name}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <p className={` ${hover && "hidden"}`}>{`\\(${tex}\\)`}</p>
      <p className={` ${hover || "hidden"}`}>{`\\(${
        texHover ? texHover : tex
      }\\)`}</p>
    </div>
  );
};

export default HoverableFormulaSimple;
