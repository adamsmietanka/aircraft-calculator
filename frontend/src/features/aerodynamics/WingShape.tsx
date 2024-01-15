interface Props {
  label?: string;
  shape: number;
  setter: (value: number) => void;
}

const WingShape = ({ label = "Wing", shape, setter }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label} Shape</span>
      </label>
      <label className="flex flex-col">
        <input
          type="range"
          min="0"
          max="2"
          value={shape}
          className="range range-xs"
          onChange={(e) => setter(parseFloat(e.target.value))}
        />
        <div className="w-full flex justify-between mt-2">
          <div className="flex -ml-3">
            <div className="tooltip" data-tip="Rectangular">
              <svg className="w-10 h-8">
                <rect
                  x={2}
                  y={10}
                  width="36"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </svg>
            </div>
          </div>
          <div className="flex">
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
          </div>
          <div className="flex -mr-3">
            <div className="tooltip" data-tip="Elliptical">
              <svg className="w-11 h-6 mt-2">
                <ellipse
                  cx="20"
                  cy="6"
                  rx="20"
                  ry="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </svg>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default WingShape;
