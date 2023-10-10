import { ReactComponent as Turtle } from "../../../../assets/turtle.svg";
import { ReactComponent as Eagle } from "../../../../assets/eagle.svg";

interface Props {
  label: string;
  value: number;
  step?: number;
  min?: number;
  max: number;
  setter: (value: number) => void;
}

const SpeedSlider = ({
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
          <p className="invisible" />
          <p> 1x</p>
          <p className="invisible" />
          <p> 2x</p>
          <p className="invisible" />
          <p className=""> 3x</p>
        </div>
      </div>
    </div>
  );
};

export default SpeedSlider;
