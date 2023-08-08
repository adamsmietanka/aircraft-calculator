import { useMemo } from "react";
import profiles from "./data/profiles";
import { useWingStore } from "./stores/useWing";
import ProfileTable from "./ProfileTable";

const ProfileChoose = () => {
  const wing = useWingStore();
  const profile = useWingStore((state) => state.profile);
  const setProfile = useWingStore((state) => state.setProfile);

  const profileList = useMemo(
    () => Object.keys(profiles).sort((a, b) => a.localeCompare(b)),
    [profiles]
  );

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">Profile</span>
      </label>
      <label className="join w-80">
        <div className="w-full">
          <select
            className="select select-bordered join-item w-full"
            onChange={(e) => setProfile(e.target.value)}
          >
            {profileList.map((p) => (
              <option key={p} selected={profile === p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn join-item bg-base-300"
          onClick={() => (window as any).profile_modal.showModal()}
        >
          Catalog
        </button>
        <dialog id="profile_modal" className="modal">
          <form method="dialog" className="modal-box max-w-2xl max-h-full">
            <h3>Profile Catalog</h3>
            <div className="">
              <ProfileTable />
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </label>
    </div>
  );
};

export default ProfileChoose;
