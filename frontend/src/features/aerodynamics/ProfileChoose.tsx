import { useMemo } from "react";
import profiles from "./data/profiles";
import { useWingStore } from "./stores/useWing";

const ProfileChoose = () => {
  const profile = useWingStore((state) => state.profile);
  const setProfile = useWingStore((state) => state.setProfile);

  const profileList = useMemo(
    () => Object.keys(profiles).sort((a, b) => a.localeCompare(b)),
    [profiles]
  );

  const handleClick = (p: string) => {
    (document.activeElement as HTMLElement).blur();
    setProfile(p);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex">Profile</span>
      </label>
      <div className="join h-12 p-0">
        <div className="dropdown dropdown-hover border rounded-btn input-bordered w-full join-item">
          <label tabIndex={0} className="label p-4 h-full">
            {profile.length !== 2
              ? `NACA ${profile}`
              : profile === "30"
              ? "Brick"
              : "Flat plate"}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-48"
          >
            <li>
              <details
                open
                onClick={() => (document.activeElement as HTMLElement).blur()}
              >
                <summary>NACA 4-series</summary>
                <ul>
                  {profileList.map(
                    (p) =>
                      p.length === 4 && (
                        <li key={p}>
                          <button
                            className={`${p === profile && "active"}`}
                            onClick={() => handleClick(p)}
                          >
                            {p}
                          </button>
                        </li>
                      )
                  )}
                </ul>
              </details>
            </li>
            <li>
              <details
                onClick={() => (document.activeElement as HTMLElement).blur()}
              >
                <summary>NACA 5-series</summary>
                <ul>
                  {[...profileList, "21012", "23012", "23015", "23018", "25012"].map(
                    (p) =>
                      p.length === 5 && (
                        <li key={p}>
                          <button
                            className={`${p === profile && "active"}`}
                            onClick={() => handleClick(p)}
                          >
                            {p}
                          </button>
                        </li>
                      )
                  )}
                </ul>
              </details>
            </li>
            <li>
              <details
                onClick={() => (document.activeElement as HTMLElement).blur()}
              >
                <summary>Flat Plate</summary>
                <ul>
                  {profileList.map(
                    (p) =>
                      p.length === 2 &&
                      p !== "30" && (
                        <li key={p}>
                          <button
                            className={`${p === profile && "active"}`}
                            onClick={() => handleClick(p)}
                          >
                            {parseFloat(p)}% thick
                          </button>
                        </li>
                      )
                  )}
                </ul>
              </details>
            </li>
            <li>
              <button
                className={`${profile === "30" && "active"}`}
                onClick={() => handleClick("30")}
              >
                Brick
              </button>
            </li>
          </ul>
        </div>

        <button
          className="btn join-item bg-base-300 w-24"
          onClick={() => (window as any).profile_modal.showModal()}
        >
          Catalog
        </button>
      </div>
    </div>
  );
};

export default ProfileChoose;
