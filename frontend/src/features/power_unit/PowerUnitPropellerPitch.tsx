import InfoTooltip from "../common/InfoTooltip";
import { usePropellerStore } from "./stores/usePropeller";
import { useOptimalFixedAngle } from "./hooks/useOptimalFixedAngle";
import ProfileIcon from "../../assets/clarkY.svg?react";


const PowerUnitPropellerPitch = () => {
  const variable = usePropellerStore((state) => state.variable);
  const angle = usePropellerStore((state) => state.angle);
  const setVariable = usePropellerStore((state) => state.setVariable);
  const setAngle = usePropellerStore((state) => state.setAngle);

  const { j_lim } = useOptimalFixedAngle();
  
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex ">
          {"Propeller pitch"}
          <InfoTooltip text="A propeller can have a blade with a fixed pitch or a variable one which changes with the speed of the aircraft" />
        </span>
      </label>
      <div className="join">
        <div
          className="btn w-16 normal-case bg-base-300 join-item"
          onClick={() => setVariable(!variable)}
        >
          <div
            className="tooltip w-9 z-50"
            data-tip={`Click to change to ${variable ? "fixed" : "variable"}`}
          >
            <ProfileIcon className={`profile w-8 ${variable && "variable"}`} />
          </div>
        </div>
        <input
          className="input input-bordered w-full join-item"
          type={variable ? "text" : "number"}
          min={10}
          max={60}
          value={variable ? "Variable" : angle}
          onChange={(e) => setAngle(parseFloat(e.target.value))}
          disabled={variable}
        />
        {!variable && (
          <div className="flex items-center justify-center w-16 h-full join-item bg-base-300">
            °
          </div>
        )}
      </div>
      {j_lim === 0 && !variable && (
        <p className="label text-xs text-error">
          The blade angle is too shallow for this much power!
        </p>
      )}
    </div>
  );
};

export default PowerUnitPropellerPitch;
