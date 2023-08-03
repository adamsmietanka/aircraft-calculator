import { useMemo } from "react";
import profiles from "./data/profiles";
import { useWingStore } from "./stores/useWing";

const ProfileChoose = () => {
  const wing = useWingStore();

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">Profile</span>
      </label>
      <select className="select select-bordered join-item w-60">
        <option disabled selected>
          Filter
        </option>
        <option>Sci-fi</option>
        <option>Drama</option>
        <option>Action</option>
      </select>
    </div>
  );
};

export default ProfileChoose;
