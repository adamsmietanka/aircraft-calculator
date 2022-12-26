import React from "react";
interface Props {
  label: string;
  unit: string;
  value: number;
  span?: number;
  setOverwriteValue?: any;
  overwittenValue?: any;
  setter: (value: number) => void;
}

const OverwritableInputNumber = ({ label, unit, value,span, setter }: Props) => {
  const [checked, setChecked] = React.useState(false);
  const handleChange = () => {
    // setOverwriteValue(overwittenValue)
    setChecked(!checked);
  };
  return (
    <div className="form-control">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <label className="input-group">
          <input
            type="number"
            step={span ? span :10}
            className="input input-bordered"
            value={value}
            onChange={(e) => setter(parseFloat(e.target.value))}
            disabled = {checked}
          />
          <span>{unit}</span>
        </label>

        <label className="label">
        <input
          className="checkbox"
          type="checkbox"
          onChange={handleChange}
          checked={checked}
        />
        <span className="label-text">{"Get "+ label.toLowerCase() + " from previous calculations"}</span>
      </label>
      </div>
  );
};

export default OverwritableInputNumber;
