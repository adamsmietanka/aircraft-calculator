import React from "react";
import { ReactComponent as Cog } from "../../assets/cog.svg";
import { useGlobalUnitsStore } from "./stores/useGlobalUnits";
import InputRadio from "../common/inputs/InputRadio";
import { useThemeStore } from "./stores/useTheme";

const Settings = () => {
  const units = useGlobalUnitsStore();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  React.useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <button
        className="btn btn-block btn-ghost justify-start"
        onClick={() => (window as any).settings_modal.showModal()}
      >
        <Cog className="mr-2" />
        Settings
      </button>
      <dialog id="settings_modal" className="modal transition-none">
        <form method="dialog" className="modal-box">
          <h3>Settings</h3>

          <InputRadio
            label="Units"
            value={units.system}
            values={["metric", "imperial"]}
            setter={units.setSystem}
          />
          <InputRadio
            label="Speed"
            value={units.types.speed}
            values={
              units.system === "metric" ? ["m/s", "km/h", "kn"] : ["mph", "kn"]
            }
            setter={units.setSpeed}
          />
          <InputRadio
            label="Theme"
            value={theme}
            values={["light", "dark", "dracula"]}
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
