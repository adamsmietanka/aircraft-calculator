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
      <div className="join h-12 w-full input input-bordered p-0">
        <div className="dropdown dropdown-hover h-full w-full">
          <label
            tabIndex={0}
            className="flex items-center justify-between p-4 cursor-pointer z-10 w-full h-full"
          >
            NACA {profile}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {profileList.map(
              (p) =>
                p !== profile && (
                  <li key={p}>
                    <button onClick={() => setProfile(p)}>NACA {p}</button>
                  </li>
                )
            )}
          </ul>
        </div>

        <button
          className="btn join-item bg-base-300 w-24"
          onClick={() => (window as any).profile_modal.showModal()}
        >
          Catalog
        </button>
        <dialog id="profile_modal" className="modal ">
          <form method="dialog" className="modal-box max-w-xl max-h-full">
            <h3>Profile Catalog</h3>
            <div className="">
              <ProfileTable />
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
      
    </div>
  );
};

export default ProfileChoose;
