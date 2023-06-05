import React from "react";
import { ReactComponent as Cog } from "../../assets/cog.svg";
import { useGlobalUnitsStore } from "./stores/useGlobalUnits";
import InputRadio from "../common/inputs/InputRadio";
import { useThemeStore } from "./stores/useTheme";

const Settings = () => {
  const units = useGlobalUnitsStore();
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  React.useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <button
        className="btn btn-block btn-ghost justify-start"
        onClick={() => (window as any).settings_modal.showModal()}
      >
        <Cog className="w-6 mr-2" />
        Settings
      </button>
      <dialog id="settings_modal" className="modal overscroll-none bg-transparent">
        <form method="dialog" className="modal-box">
          <h3>Settings</h3>

          <InputRadio
            label="Units"
            value={units.type}
            values={["metric", "imperial"]}
            setter={units.setType}
          />
          <InputRadio
            label="Speed"
            value={units.speed}
            values={
              units.type === "metric" ? ["m/s", "km/h", "kn"] : ["mph", "kn"]
            }
            setter={units.setSpeed}
          />
          <InputRadio
            label="Theme"
            value={theme}
            values={["light", "dark"]}
            setter={setTheme}
          />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Settings;
