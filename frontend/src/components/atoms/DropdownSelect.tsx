import React from "react";
interface dropdownSelect {
  label: string;
  options: { name: string; value: number }[];
  setter: (value: number) => void;
}
const DropdownSelect = ({ label, options, setter }: dropdownSelect) => {
  return (
    <div className="flexbox flex-col mt-2 mb-2">
      <label className="label">
        <span className="label-text"> {label}</span>
      </label>
      <select
        className="select select-bordered w-60 max-w-xs"
        onChange={(e) => setter(parseFloat(e.target.value))}
      >
        {options.map((option) => (
          <option key={option.name} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelect;
