interface Props {
  label: string;
  unit: string;
  value: number;
  step?: number;
  min?: number;
  max: number;
  setter: (value: number) => void;
}

const InputSlider = ({
  label,
  unit,
  value,
  step = 1,
  min = 0,
  max,
  setter,
}: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <label className="flex items-center">
        <div className="flex w-full pr-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setter(parseFloat(e.target.value))}
            className="range range-xs"
          />
        </div>
        <span
          className="flex items-center justify-center w-24 rounded-lg h-12 bg-base-span"
        >
          {value} {unit}
        </span>
      </label>
    </div>
  );
};

export default InputSlider;
