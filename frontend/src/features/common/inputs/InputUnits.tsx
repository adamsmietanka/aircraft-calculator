import InfoTooltip from "../InfoTooltip";
import { useUnits } from "../../settings/hooks/useUnits";

interface Props {
  type: string;
  small?: boolean;
  label: string;
  value: number;
  min?: number;
  tooltip?: string;
  disabled?: boolean;
  setter?: (value: number) => void;
}

const InputUnits = ({
  type,
  small = false,
  label,
  value,
  min = 0,
  tooltip,
  disabled = false,
  setter,
}: Props) => {
  const { unit, setUnit, units, multiplier, step, displayValue } = useUnits(
    value,
    type
  );

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
      </label>
      <div className="join w-full">
        <input
          className={`join-item input input-bordered w-full ${
            small && "input-2sm"
          }`}
          type="number"
          step={step}
          value={displayValue}
          min={min}
          disabled={disabled}
          onChange={(e) =>
            setter && setter(parseFloat(e.target.value) * multiplier)
          }
        />
        <div className="dropdown dropdown-hover dropdown-right join-item z-50">
          <label
            tabIndex={0}
            className="flex items-center justify-center cursor-pointer bg-base-span z-10 w-16 h-full"
          >
            {unit}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu shadow bg-base-200 rounded-box p-0 w-16 [&_li>*]:rounded-2xl"
          >
            {Object.keys(units).map(
              (u) =>
                u !== unit && (
                  <li key={u} onClick={() => setUnit(u)}>
                    <button
                      className={`flex justify-center ${!small && "h-12"}`}
                    >
                      {u}
                    </button>
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InputUnits;
