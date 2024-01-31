import { useHorizontalStore } from "../stores/useHorizontal";
import Fuse from "../../../assets/tails/tailFuse.svg?react";
import T from "../../../assets/tails/tailT.svg?react";

const HorizontalPosition = () => {
  const position = useHorizontalStore((state) => state.position);
  const setPosition = useHorizontalStore((state) => state.setPosition);
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Tail Position</span>
      </label>
      <label className="flex flex-col">
        <input
          type="range"
          min="0"
          max="1"
          step={0.1}
          value={position}
          className="range range-xs"
          onChange={(e) => setPosition(parseFloat(e.target.value))}
        />
        <div className="w-full flex justify-between mt-2">
          <div className="flex -ml-3">
            <div className="tooltip" data-tip="Fuselage">
              <Fuse className="w-10 h-8 mt-1 " />
            </div>
          </div>
          {/* <div className="flex">
            <div className="tooltip" data-tip="Trapezoidal">
              <svg className="w-11 h-6 mt-2">
                <polyline
                  points="2,5 20,1 38,5 38,12 20,10 2,12 2,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </svg>
            </div>
          </div> */}
          <div className="flex -mr-3">
            <div className="tooltip" data-tip="T tail">
              <T className="w-10 h-8 mt-1 " />
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default HorizontalPosition;
