import React from "react";

interface Props {
  label: string;
  unit: string;
  value: number;
  setter: (value: number) => void;
  step?: number;
}

const InputNumber = ({label, unit, value, setter, step}: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <label className="input-group">
        <input
          type="number"
          step={step ? step :10}
          className="input input-bordered"
          value={value}
          onChange={(e) => setter(parseFloat(e.target.value))}
        />
        <span>{unit}</span>
      </label>
    </div>
  );
};

export default InputNumber;
