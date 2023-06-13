import React from "react";

interface Props {
  label: string;
  values: string[];
  value: string;
  setter: (value: string) => void;
  //   tooltip?: string;
}

const InputRadio = ({ label, values, value, setter }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="join">
        {values.map((v) => (
          <input
            key={v}
            className="join-item btn"
            type="radio"
            name={v}
            aria-label={v}
            checked={value === v}
            onChange={(e) => setter(e.target.ariaLabel as string)}
          />
        ))}
      </div>
    </div>
  );
};

export default InputRadio;
