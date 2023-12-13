interface Props {
  small?: boolean;
  value: number;
  setter?: (value: number) => void;
}

const InputDrawingAngle = ({ small = false, value, setter }: Props) => {
  return (
    <div className="flex">
      <input
        className={`input w-28 text-center bg-transparent focus:outline-none focus:border-transparent pl-8 z-50 ${
          small && "input-2sm"
        }`}
        type="number"
        value={value}
        min={0}
        max={45}
        onChange={(e) => setter && setter(parseFloat(e.target.value))}
      />
      <div className="absolute top-0 left-0 bottom-0 h-12 ml-8 w-14 flex items-center justify-center text-center z-1">
        <span className="invisible" id="hiddenValue">
          {value}
        </span>
        <span className="units-value" id="unitsValue">
          &deg;
        </span>
      </div>
    </div>
  );
};

export default InputDrawingAngle;
