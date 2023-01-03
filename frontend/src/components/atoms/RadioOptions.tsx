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
          <div className="label justify-left w-60" key={text}>
            <input
              type="radio"
              className="radio radio-sm mr-2"
              value={text}
              checked={text === checkedButton}
              onChange={() => setCheckedButton(text)}
            />
            <span className="label-text align"> {text} </span>
          </div>
        ))}
    </div>
  );
};

export default RadioOptions;
