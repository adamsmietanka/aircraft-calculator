import { ReactComponent as Arrow } from "../../assets/arrow.svg";
import { ReactComponent as Fuse1 } from "../../assets/fuselages/2301.svg";
import { ReactComponent as Fuse2 } from "../../assets/fuselages/2302.svg";
import { ReactComponent as Fuse3 } from "../../assets/fuselages/2303.svg";
import { ReactComponent as Fuse4 } from "../../assets/fuselages/2304.svg";
import { usePlaneStore } from "./stores/usePlane";
import React from "react";

const FuselageChoose = () => {
  const handleClick = (config: string) => {
    (document.activeElement as HTMLElement).blur();
    setFuselage(parseFloat(config));
  };

  const configs: Record<string, JSX.Element> = {
    2301: <Fuse1 />,
    2302: <Fuse2 />,
    2303: <Fuse3 />,
    2304: <Fuse4 />,
  };

  const fuselage = usePlaneStore((state) => state.fuselage);
  const setFuselage = usePlaneStore((state) => state.setFuselage);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">Fuselage</span>
      </label>
      <div className="join h-12 w-60 input input-bordered p-0">
        <div className="dropdown dropdown-hover h-full w-full">
          <label
            tabIndex={0}
            className="flex items-center justify-between p-4 cursor-pointer z-10 w-full h-full"
          >
            {React.cloneElement(configs[fuselage], {
              className: "w-36 ml-2",
            })}
            <Arrow className="transform rotate-90 ml-2" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {Object.keys(configs).map((c) => (
              <li key={c} className="">
                <a className="py-4" onClick={() => handleClick(c)}>
                  {React.cloneElement(configs[c], {
                    className: "w-36",
                  })}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FuselageChoose;
