import { useState } from "react";

interface Props {
  name: string;
  tex: string;
  texHover: string;
  center?: boolean;
}

const HoverableFormulaSimple = ({
  name,
  tex,
  texHover,
  center = true,
}: Props) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`tooltip h-8 flex ${center && "items-left"}`}
      data-tip={name}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <p className={` ${hover && "hidden"}`}>{`\\(${tex}\\)`}</p>
      <p className={` ${hover || "hidden"}`}>{`\\(${texHover}\\)`}</p>
    </div>
  );
};

export default HoverableFormulaSimple;
