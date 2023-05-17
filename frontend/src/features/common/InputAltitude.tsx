import { useState } from "react";
import InfoTooltip from "./InfoTooltip";

interface Props {
  label: string;
  value: number;
  tooltip?: string;
  disabled?: boolean;
  setter: (value: number) => void;
}
interface UnitData {
  step: number;
  multiplier: number;
  round?: boolean;
}
const data: Record<string, UnitData> = {
  km: {
    step: 0.1,
    multiplier: 1,
  },
  m: {
    step: 100,
    multiplier: 0.001,
    round: true,
  },
  ft: {
    step: 1000,
    multiplier: 0.0003048,
    round: true,
  },
};

const InputAltitude = ({
  label,
  value,
  tooltip,
  disabled = false,
  setter,
}: Props) => {

  const [unit, setUnit] = useState("km");
  
  const { multiplier, step, round } = data[unit];
  const displayValue = round
    ? Math.round(value / multiplier)
    : value / multiplier;

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
      </label>
      <label className="input-group">
        <input
          className="input input-bordered w-full"
          type="number"
          step={step}
          value={displayValue}
          min={0}
          disabled={disabled}
          onChange={(e) => setter(parseFloat(e.target.value) * multiplier)}
        />
        <span className="dropdown dropdown-hover flex items-center justify-center w-20 rounded-lg h-12">
          <div>
            <label tabIndex={0}>{unit}</label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li onClick={() => setUnit("km")}>
                <a>km</a>
              </li>
              <li onClick={() => setUnit("m")}>
                <a>m</a>
              </li>
              <li onClick={() => setUnit("ft")}>
                <a>ft</a>
              </li>
            </ul>
          </div>
        </span>
      </label>
    </div>
  );
};

export default InputAltitude;
