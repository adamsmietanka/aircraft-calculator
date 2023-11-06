import { useWingStore } from "../../stores/useWing";

interface Props {
  value?: number;
  setter?: (value: number) => void;
}

const SpeedSlider = ({ value, setter }: Props) => {
  const reynolds = useWingStore((state) => state.reynolds);
  const setReynolds = useWingStore((state) => state.setReynolds);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Speed</span>
      </label>
      <div className="flex flex-col">
        <input
          type="range"
          min={3}
          step={1.5}
          max={12}
          value={reynolds}
          onChange={(e) => setReynolds(parseFloat(e.target.value))}
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
