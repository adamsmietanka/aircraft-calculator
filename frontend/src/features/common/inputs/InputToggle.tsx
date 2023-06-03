import InfoTooltip from "../InfoTooltip";

interface Props {
  label: string;
  value: boolean;
  tooltip?: string;
  disabled?: boolean;
  setter: (value: boolean) => void;
}

const InputToggle = ({
  label,
  value,
  tooltip,
  disabled = false,
  setter,
}: Props) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text flex">
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
        <input
          type="checkbox"
          className="toggle"
          checked={value}
          disabled={disabled}
          onChange={(e) => setter(!value)}
        />
      </label>
    </div>
  );
};

export default InputToggle;
