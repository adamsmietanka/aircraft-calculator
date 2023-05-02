import InfoTooltip from "./InfoTooltip";

interface Props {
  label: string;
  unit: string;
  value: number;
  step?: number;
  min?: number;
  tooltip?: string;
  disabled?: boolean;
  setter: (value: number) => void;
}

const InputNumber = ({
  label,
  unit,
  value,
  step = 1,
  min = 0,
  tooltip,
  disabled = false,
  setter,
}: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
      </label>
      <label className="input-group input-group-2sm">
        <input
          className="input input-bordered input-2sm input-md w-full"
          type="number"
          step={step}
          value={value}
          min={min}
          disabled={disabled}
          onChange={(e) => setter(parseFloat(e.target.value))}
        />
        <span className="flex items-center justify-center w-20 rounded-lg">
          {unit}
        </span>
      </label>
    </div>
  );
};

export default InputNumber;
