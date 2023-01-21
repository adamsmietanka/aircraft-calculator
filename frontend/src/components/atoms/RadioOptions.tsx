import React from "react";

interface Props {
  options: Array<string>;
  checkedButton: string;
  setCheckedButton: (value: string) => void;
}

const RadioOptions = ({ options, checkedButton, setCheckedButton }: Props) => {
  return (
    <div>
      {options &&
        options.map((text) => (
          <div className="form-control" key={text}>
            <label className="label cursor-pointer">
              <input
                type="radio"
                className="radio radio-sm mr-2"
                value={text}
                checked={text === checkedButton}
                onChange={() => setCheckedButton(text)}
              />
              <span className="label-text"> {text} </span>
            </label>
          </div>
        ))}
    </div>
  );
};

export default RadioOptions;
