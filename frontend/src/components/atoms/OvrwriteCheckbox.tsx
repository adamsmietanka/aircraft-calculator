import React from "react";

interface Props {
  label: string;
  setOverwriteValue?: any;
  overwittenValue?: any;
}

const OverwriteCheckbox = ({
  label,
  setOverwriteValue,
  overwittenValue,
}: Props) => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    // setOverwriteValue(overwittenValue)
    setChecked(!checked);
  };

  return (
    <div>
      <label className="label">
        <input className="checkbox" type="checkbox" onChange={handleChange} checked={checked} />
        <span className="label-text">{label}</span>
      </label>
    </div>
  );
};

export default OverwriteCheckbox;
