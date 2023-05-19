import { ReactComponent as Padlock } from "../../assets/padlock.svg";
import { useRef } from "react";
import InfoTooltip from "../common/InfoTooltip";
import { usePropellerStore } from "./stores/usePropeller";

interface Props {
  tooltip?: string;
}

const PowerUnitPropellerPitch = ({ tooltip }: Props) => {
  const lockRef = useRef<SVGSVGElement>(null);

  const variable = usePropellerStore((state) => state.variable);
  const angle = usePropellerStore((state) => state.angle);
  const setVariable = usePropellerStore((state) => state.setVariable);
  const setAngle = usePropellerStore((state) => state.setAngle);

  const toggleClass = () => {
    const element = lockRef.current;
    if (element) {
      variable
        ? element.classList.add("locked")
        : element.classList.remove("locked");
      setVariable(!variable);
    }
  };
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex ">
          {"Propeller pitch"}
          <InfoTooltip text="A propeller can have a blade with a fixed pitch or a variable one which changes with speed of the aircraft" />
        </span>
      </label>
      <label className="input-group">
        <span
          className="px-4"
          onClick={toggleClass}
        >
          <div className="cursor-pointer w-6 svg-color text-color z-50" data-tip="">
            <Padlock ref={lockRef} />
          </div>
        </span>
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
