import React from "react";

interface Props {
  label: string;
  unit: string;
  value: number;
  setter: (value: number) => void;
}

const InputNumber = ({label, unit, value, setter}: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <label className="input-group">
        <input
          type="text"
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
