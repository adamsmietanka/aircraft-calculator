interface prpos {
  collapseTittle: string;
  outputLabel?: string;
  caluclatedValue?: number;
  unit?: string;
}
const CollapseHeader = ({
  collapseTittle,
  outputLabel,
  caluclatedValue,
  unit,
}: prpos) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-medium pb-1"> {collapseTittle}</h2>
      <div className="flex flex-row justify-center font-normal">
        {outputLabel && <h3 className="text-l pr-1">{outputLabel}</h3>}
        {caluclatedValue && <h3 className="text-l">{caluclatedValue.toPrecision(2)}</h3>}
        {unit && <h3 className="text-l pl-1">{unit}</h3>}
      </div>
    </div>
  );
};

export default CollapseHeader;
