import React from "react";
import { ReactComponent as Cog } from "../../assets/cog.svg";
import { useGlobalUnitsStore } from "./stores/useGlobalUnits";
import InputRadio from "../common/inputs/InputRadio";
import { useThemeStore } from "./stores/useTheme";
import InputToggle from "../common/inputs/InputToggle";
import { useSettingsStore } from "./stores/useSettings";

const Settings = () => {
  const units = useGlobalUnitsStore();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const settings = useSettingsStore();

  React.useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <button
        className="btn btn-block btn-ghost justify-start"
        onClick={() => (window as any).settings_modal.showModal()}
      >
        <Cog className="w-6" />
      </button>
      <dialog id="settings_modal" className="modal">
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
            label="Power"
            value={units.types.power}
            values={["kW", "hp"]
            }
            setter={units.setPower}
          />
          <InputRadio
            label="Theme"
            value={theme}
            values={["light", "dark", "dracula", "business"]}
            setter={setTheme}
          />

          <h3 className="pt-2">Models</h3>
          <div className="w-40">
            <InputToggle
              label="Wireframe"
              value={settings.wireframe}
              setter={settings.setWireframe}
            />
            <InputToggle
              label="Auto Rotate"
              value={settings.autoRotate}
              setter={settings.setAutoRotate}
            />
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Settings;
