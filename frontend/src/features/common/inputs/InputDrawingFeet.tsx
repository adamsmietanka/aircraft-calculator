import { useEffect, useState } from "react";
import { unitMultipliers } from "../../settings/data/units";

interface Props {
  small?: boolean;
  value: number;
  min?: number;
  max?: number;
  setter?: (value: number) => void;
}

const InputDrawingFeet = ({
  small = false,
  value,
  min = 0,
  max = 100000,
  setter,
}: Props) => {
  const multiplier = unitMultipliers.length.ft;

  const [feet, setFeet] = useState(Math.floor(value / multiplier));
  const [inches, setInches] = useState(((value / multiplier) % 1) * 12);

  useEffect(() => {
    const val = feet + inches / 12;
    if (inches >= 12 && val <= max) {
      setInches(0);
      setFeet(feet + 1);
    }
    if (inches < 0 && min <= val) {
      setInches(inches + 12);
      setFeet(feet - 1);
    }
    setter && min <= val && val <= max && setter(val * multiplier);
  }, [feet, inches]);

  return (
    <div className="flex justify-between w-15">
      <div className="flex">
        <input
          className={`input w-8 p-0 ml-6 text-left bg-transparent focus:border-transparent z-50 focus:outline-none ${
            small && "input-2sm"
          }`}
          type="number"
          value={feet}
          step={1}
          min={Math.floor(min)}
          max={Math.floor(max)}
          onChange={(e) => setFeet(parseFloat(e.target.value))}
          onBlur={() => setFeet(Math.floor(value / multiplier))}
        />
        <div className="absolute top-0 bottom-0 ml-6 pl-1 flex items-center justify-center text-center">
          <span className="invisible z-0">{feet}</span>
          <span>'</span>
        </div>
      </div>
      <div className="flex">
        <input
          className={`input p-0 w-12 bg-transparent -ml-2 focus:border-transparent focus:outline-none z-10 ${
            small && "input-2sm"
          }`}
          type="number"
          step={0.5}
          value={parseFloat(inches.toPrecision(4))}
          onChange={(e) => setInches(parseFloat(e.target.value))}
          onBlur={() => setInches(((value / multiplier) % 1) * 12)}
        />
        <div className="absolute top-0 bottom-0 -ml-2 pl-0.5 flex items-center justify-center text-center">
          <span className="invisible z-0">
            {parseFloat(inches.toPrecision(4))}
          </span>
          <span>''</span>
        </div>
      </div>
    </div>
  );
};

export default InputDrawingFeet;
