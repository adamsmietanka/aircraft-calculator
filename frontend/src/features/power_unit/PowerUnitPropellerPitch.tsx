import InfoTooltip from "../common/InfoTooltip";
import { usePropellerStore } from "./stores/usePropeller";
import BladePitch from "../common/BladePitch";
import { useOptimalFixedAngle } from "./hooks/useOptimalFixedAngle";

interface Props {
  tooltip?: string;
}

const PowerUnitPropellerPitch = ({ tooltip }: Props) => {
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
        <BladePitch variable={variable} setVariable={setVariable} />
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
      {j_lim === 0 && (
        <p className="label text-xs text-error">
          The blade angle is too shallow for this much power!
        </p>
      )}
    </div>
  );
};

export default PowerUnitPropellerPitch;
