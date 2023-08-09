import { useState } from "react";
import { reynolds } from "./data/profiles";
import { useWingStore } from "./stores/useWing";

const ProfileReynolds = () => {
  const profile = useWingStore((state) => state.profile);
  const reynoldsIndex = useWingStore((state) => state.reynolds);
  const setReynolds = useWingStore((state) => state.setReynolds);
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">Reynolds Number</span>
      </label>
      <div className="join h-12 w-full input input-bordered p-0">
        <div className="dropdown dropdown-hover h-full w-full">
          <label
            tabIndex={0}
            className="flex items-center justify-between p-4 cursor-pointer z-10 w-full h-full"
          >
            {reynolds[profile][reynoldsIndex]}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {reynolds[profile].map((p, index) => (
              <li key={p}>
                <button onClick={() => setReynolds(index)}>{p}</button>
              </li>
            ))}
          </ul>
        </div>

        <span className="btn join-item bg-base-300">10⁶</span>
      </div>
    </div>
  );
};

export default ProfileReynolds;
