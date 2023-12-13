import { useUnits } from "../../settings/hooks/useUnits";

interface Props {
  small?: boolean;
  value: number;
  min?: number;
  setter?: (value: number) => void;
}

const InputDrawing = ({ small = false, value, min = 0, setter }: Props) => {
  const { multiplier, step, displayValue } = useUnits(value, "length");

  return (
    <input
      className={`input w-28 text-center bg-transparent focus:border-transparent focus:outline-none pl-8 ${
        small && "input-2sm"
      }`}
      type="number"
      step={step}
      value={displayValue}
      min={min}
      onChange={(e) =>
        setter && setter(parseFloat(e.target.value) * multiplier)
      }
    />
  );
};

export default InputDrawing;
