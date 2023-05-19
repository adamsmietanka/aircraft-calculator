import InfoTooltip from "./InfoTooltip";

interface Props {
  label: string;
  unit?: string;
  value: number | string;
  tooltip?: string;
}

const InputDisabled = ({ label, unit, value, tooltip }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
      </label>
      <label className={`${!!unit && "input-group"}`}>
        <input
          className="input input-bordered w-full"
          type="number"
          value={value}
          disabled={true}
        />
        {unit && (
          <span className="flex items-center justify-center w-20 rounded-lg h-12">
            {unit}
          </span>
        )}
      </label>
    </div>
  );
};

export default InputDisabled;
