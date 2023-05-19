import InfoTooltip from "./InfoTooltip";
import { ReactComponent as Padlock } from "../../assets/padlock.svg";
import { useRef, useState } from "react";

interface Props {
  label: string;
  unit?: string;
  value: number | string;
  tooltip?: string;
}

const InputPadlock = ({ label, unit, value, tooltip }: Props) => {
  const [locked, setLocked] = useState(true);
  const lockRef = useRef<SVGSVGElement>(null);

  const toggleClass = () => {
    const element = lockRef.current;
    if (element) {
      locked
        ? element.classList.add("locked")
        : element.classList.remove("locked");
      setLocked(() => !locked);
    }
  };
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex ">
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
      </label>
      <label className="input-group">
        <span
          className=" px-2 "
          onClick={toggleClass}
        >
          <div className="tooltip cursor-pointer w-6 svg-color text-color z-50" data-tip="Locking makes the value computed from the graph. Unlocking enables manual input">
            <Padlock ref={lockRef} />
          </div>
        </span>
        <input
          className="input input-bordered w-full"
          type="number"
          value={value}
          disabled={!locked}
        />
        {unit && (
          <span className="flex items-center justify-center w-20 rounded-lg h-12">
            {unit}
          </span>
        )}
      </label>
    </div>
  );
};

export default InputPadlock;
