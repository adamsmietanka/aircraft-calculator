import { reynolds } from "./data/profiles";
import { useWingStore } from "./stores/useWing";
import InfoTooltip from "../common/InfoTooltip";
import Formula from "../common/Formula";

const ProfileReynolds = () => {
  const profile = useWingStore((state) => state.profile);
  const reynoldsIndex = useWingStore((state) => state.reynolds);
  const setReynolds = useWingStore((state) => state.setReynolds);
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">
          Reynolds Number{" "}
          <InfoTooltip
            text={
              "The Reynolds number represents the ratio of inertial forces to viscous forces in a fluid. Directly proportional to velocity"
            }
          />
        </span>
      </label>
      <div className="join items-center">
        <input
          type="range"
          min={0}
          max={2}
          value={reynoldsIndex}
          onChange={(e) => setReynolds(parseFloat(e.target.value))}
          className="range range-xs join-item pr-2"
        />
        <button className="btn w-24 h-12 bg-base-300 join-item">
          <Formula tex={`${reynolds[profile][reynoldsIndex]}*10^6`} />
        </button>
      </div>
    </div>
  );
};

export default ProfileReynolds;
