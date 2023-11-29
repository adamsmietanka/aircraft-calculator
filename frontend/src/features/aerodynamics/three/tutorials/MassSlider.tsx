import { ReactComponent as Mass } from "../../../../assets/mass.svg";

interface Props {
  value: number;
  setter: (value: number) => void;
}

const MassSlider = ({ value, setter }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Mass</span>
      </label>
      <div className="flex flex-col">
        <input
          type="range"
          min={0.3}
          step={0.1}
          max={0.7}
          value={value}
          onChange={(e) => setter(parseFloat(e.target.value))}
          className="range range-xs join-item pr-2"
        />
        <div className="w-full flex justify-between mt-1">
          <Mass className="w-5 h-8 -ml-2" />
          <Mass className="w-8 h-8 -mr-2" />
        </div>
      </div>
    </div>
  );
};

export default MassSlider;
