import { ReactComponent as Arrow } from "../../assets/arrow.svg";
import { usePlaneStore } from "./stores/usePlane";

const FuselageConfiguration = () => {
  const handleClick = (config: number) => {
    (document.activeElement as HTMLElement).blur();
    setConfiguration(config);
  };

  const configs = [
    "Conventional",
    "Bi-plane",
    "Twin Fuse",
    "Twin fuselage Bi-plane",
  ];

  const configuration = usePlaneStore((state) => state.configuration);
  const setConfiguration = usePlaneStore((state) => state.setConfiguration);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">Configuration</span>
      </label>
      <div className="join h-12 w-60 input input-bordered p-0">
        <div className="dropdown dropdown-hover h-full w-full">
          <label
            tabIndex={0}
            className="flex items-center justify-between p-4 cursor-pointer z-10 w-full h-full"
          >
            {configs[configuration]}
            <Arrow className="transform rotate-90 ml-2" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {configs.map((c, index) => (
              <li key={c}>
                <a className="" onClick={() => handleClick(index)}>
                  <p>{c}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FuselageConfiguration;
