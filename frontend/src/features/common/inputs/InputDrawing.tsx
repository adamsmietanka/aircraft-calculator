import { useEffect, useState } from "react";
import { useUnits } from "../../settings/hooks/useUnits";
import InputDrawingFeet from "./InputDrawingFeet";

interface Props {
  small?: boolean;
  value: number;
  min?: number;
  max?: number;
  setter?: (value: number) => void;
}

const InputDrawing = ({
  small = false,
  value,
  min = 0,
  max = 1000,
  setter,
}: Props) => {
  const { multiplier, step, unit } = useUnits(value, "length");

  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  // TODO: Add better validation
  // useEffect(() => {
  //   setter && min <= local && local <= max && setter(local);
  // }, [local]);

  return unit === "ft" ? (
    <InputDrawingFeet
      value={local}
      min={min / multiplier}
      max={max / multiplier}
      setter={setter}
    />
  ) : (
    <input
      className={`input w-28 text-center bg-transparent focus:border-transparent focus:outline-none pl-8 ${
        small && "input-2sm"
      }`}
      type="number"
      step={step}
      value={value}
      min={min / multiplier}
      max={max / multiplier}
      onChange={(e) => {
        const val = parseFloat(e.target.value);
        setter && max >= val && val >= min && setter(val);
      }}
      // onBlur={() => setter && setter(value)}
    />
  );
};

export default InputDrawing;
