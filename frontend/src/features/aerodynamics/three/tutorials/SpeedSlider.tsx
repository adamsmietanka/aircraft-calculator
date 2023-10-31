import { ReactComponent as Turtle } from "../../../../assets/turtle.svg";
import { ReactComponent as Eagle } from "../../../../assets/eagle.svg";

interface Props {
  value: number;
  setter: (value: number) => void;
}

const SpeedSlider = ({ value, setter }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Speed</span>
      </label>
      <div className="flex flex-col">
        <input
          type="range"
          min={0.5}
          step={0.25}
          max={2}
          value={value}
          onChange={(e) => setter(parseFloat(e.target.value))}
          className="range range-xs join-item pr-2"
        />
        <div className="w-full grid grid-cols-4 gap-4 mt-1 text-center">
          <p>0.5x</p>
          <p>1x</p>
          <p>1.5x</p>
          <p>2x</p>
        </div>
      </div>
    </div>
  );
};

export default SpeedSlider;
