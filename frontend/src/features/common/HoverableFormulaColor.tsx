interface Props {
  name: string;
  hover: boolean;
  tex: string;
  center?: boolean;
  tooltipLeft?: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

const HoverableFormulaColor = ({
  name,
  tex,
  center = false,
  tooltipLeft = false,
  onEnter,
  onLeave,
  hover,
}: Props) => {
  return (
    <div
      className={`tooltip ${tooltipLeft && "tooltip-left"} 
      } ${hover && "text-error"}`}
      data-tip={name}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <p>{`\\(${tex}\\)`}</p>
    </div>
  );
};

export default HoverableFormulaColor;
