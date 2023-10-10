import { ReactComponent as Mass } from "../../../../assets/mass.svg";

interface Props {
  label: string;
  value: number;
  step?: number;
  min?: number;
  max: number;
  setter: (value: number) => void;
}

const MassSlider = ({
  label,
  value,
  step = 1,
  min = 0,
  max,
  setter,
}: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="flex flex-col">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setter(parseFloat(e.target.value))}
          className="range range-xs join-item pr-2"
        />
        <div className="w-full flex justify-between mt-1">
          <Mass className={`w-5 h-8 text-color -ml-2 `} />
          <Mass className={`w-8 h-8 text-color `} />
        </div>
      </div>
    </div>
  );
};

export default MassSlider;
