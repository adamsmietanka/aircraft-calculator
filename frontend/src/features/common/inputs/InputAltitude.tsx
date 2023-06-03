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
    : Math.round((value / multiplier) * 1000) / 1000;

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
      </label>
      <div className="join w-full items-stretch">
        <input
          className="join-item input input-bordered w-full"
          type="number"
          step={step}
          value={displayValue}
          min={0}
          disabled={disabled}
          onChange={(e) => setter(parseFloat(e.target.value) * multiplier)}
        />
        <div className="dropdown dropdown-hover join-item ">
          <label
            tabIndex={0}
            className="flex items-center justify-center cursor-pointer w-16 h-12 bg-base-span"
          >
            {unit}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-16 z-50"
          >
            {Object.keys(data).map((u) => (
              u !== unit && <li key={u} onClick={() => setUnit(u)}>
                <button className="flex justify-center">{u}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InputAltitude;
