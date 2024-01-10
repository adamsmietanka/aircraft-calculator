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
      <div className="join items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setter(parseFloat(e.target.value))}
          className="range range-xs join-item pr-2"
        />
        <span className="flex items-center justify-center w-24 h-12 bg-base-300 join-item">
          {value} {unit}
        </span>
      </div>
    </div>
  );
};

export default InputSlider;
