import { ReactComponent as Two } from "../../assets/blades/two.svg";
import { ReactComponent as Three } from "../../assets/blades/three.svg";
import { ReactComponent as Four } from "../../assets/blades/four.svg";
import { usePropellerStore } from "./stores/usePropeller";
import { useDidMount } from "./hooks/useDidMount";

const PowerUnitPropellerBlades = () => {
  const blades = usePropellerStore((state) => state.blades);
  const setBlades = usePropellerStore((state) => state.setBlades);

  const didMount = useDidMount();

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Number of blades</span>
      </label>
      <label className="flex flex-col">
        <input
          type="range"
          min="2"
          max="4"
          value={blades}
          className="range range-xs"
          step="1"
          onChange={(e) => setBlades(parseFloat(e.target.value))}
        />
        <div className="w-full flex justify-between mt-1">
          <Two
            className={`w-8 h-8 text-color -ml-2 ${
              didMount() && blades === 2 && "animate-spin-slow"
            }`}
          />
          <Three
            className={`w-8 h-8 text-color ${
              didMount() && blades === 3 && "animate-spin-slow"
            }`}
          />
          <Four
            className={`w-8 h-8 text-color -mr-2 ${
              didMount() && blades === 4 && "animate-spin-slow"
            }`}
          />
        </div>
      </label>
    </div>
  );
};

export default PowerUnitPropellerBlades;