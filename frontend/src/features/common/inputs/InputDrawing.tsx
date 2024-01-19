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
  max = 100000,
  setter,
}: Props) => {
  const { multiplier, step, unit } = useUnits(value, "length");

  const [local, setLocal] = useState(value);
  console.log(step, local, multiplier);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    setter && min <= local && local <= max && setter(local);
  }, [local]);

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
      value={parseFloat((local / multiplier).toPrecision(4))}
      min={min / multiplier}
      max={max / multiplier}
      onChange={(e) => setLocal(parseFloat(e.target.value) * multiplier)}
      onBlur={() => setLocal(value)}
    />
  );
};

export default InputDrawing;
