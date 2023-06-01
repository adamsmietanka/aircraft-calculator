import { useState } from "react";
import InfoTooltip from "../InfoTooltip";

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
  "m/s": {
    step: 1,
    multiplier: 1,
  },
  "km/h": {
    step: 1,
    multiplier: 0.277778,
    round: true,
  },
  mph: {
    step: 1,
    multiplier: 0.44704,
    round: true,
  },
  kn: {
    step: 1,
    multiplier: 0.514444,
    round: true,
  },
};

const InputSpeed = ({
  label,
  value,
  tooltip,
  disabled = false,
  setter,
}: Props) => {
  const [unit, setUnit] = useState("m/s");

  const { multiplier, step, round } = data[unit];
  const displayValue = round
    ? Math.round(value / multiplier)
    : Math.round(value / multiplier);

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
              <li onClick={() => setUnit("m/s")}>
                <a>m/s</a>
              </li>
              <li onClick={() => setUnit("km/h")}>
                <a>km/h</a>
              </li>
              <li onClick={() => setUnit("mph")}>
                <a>mph</a>
              </li>
              <li onClick={() => setUnit("kn")}>
                <a>kn</a>
              </li>
            </ul>
          </div>
        </span>
      </label>
    </div>
  );
};

export default InputSpeed;
