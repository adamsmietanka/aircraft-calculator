import InfoTooltip from "../common/InfoTooltip";
import { usePropellerStore } from "./stores/usePropeller";
import BladePitch from "../common/BladePitch";

interface Props {
  tooltip?: string;
}

const PowerUnitPropellerPitch = ({ tooltip }: Props) => {
  const variable = usePropellerStore((state) => state.variable);
  const angle = usePropellerStore((state) => state.angle);
  const setVariable = usePropellerStore((state) => state.setVariable);
  const setAngle = usePropellerStore((state) => state.setAngle);
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex ">
          {"Propeller pitch"}
          <InfoTooltip text="A propeller can have a blade with a fixed pitch or a variable one which changes with the speed of the aircraft" />
        </span>
      </label>
      <label className="input-group">
        <BladePitch variable={variable} setVariable={setVariable} />
        <input
          className="input input-bordered w-full"
          type={variable ? "text" : "number"}
          value={variable ? "Variable" : angle}
          onChange={(e) => setAngle(parseFloat(e.target.value))}
          disabled={variable}
        />
        {!variable && (
          <span className="flex items-center justify-center w-20 rounded-lg h-12">
            {"°"}
          </span>
        )}
      </label>
    </div>
  );
};

export default PowerUnitPropellerPitch;
