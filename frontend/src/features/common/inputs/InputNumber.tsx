import round from "../../../utils/interpolation/round";
import InfoTooltip from "../InfoTooltip";

interface Props {
  label: string;
  unit?: string;
  value: number;
  step?: number;
  min?: number;
  tooltip?: string;
  disabled?: boolean;
  roundTo?: number;
  setter?: (value: number) => void;
}

const InputNumber = ({
  label,
  unit,
  value,
  step = 1,
  min = 0,
  tooltip,
  disabled = false,
  roundTo = 0.001,
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
      <label className="join">
        <input
          className="input input-bordered w-full join-item"
          type="number"
          step={step}
          value={round(value, roundTo)}
          min={min}
          disabled={disabled}
          onChange={(e) => setter && setter(parseFloat(e.target.value))}
        />
        {unit && (
          <div className="flex items-center justify-center w-20 rounded-lg h-12 join-item bg-base-300">
            {unit}
          </div>
        )}
      </label>
    </div>
  );
};

export default InputNumber;
