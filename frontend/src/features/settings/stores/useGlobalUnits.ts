import { produce } from "immer";
import { create } from "zustand";

interface GlobalUnitsState {
  system: string;
  types: Record<string, string>;
  setSystem: (value: string) => void;
  setSpeed: (value: string) => void;
  setPower: (value: string) => void;
  setAltitude: (value: string) => void;
}

export const useGlobalUnitsStore = create<GlobalUnitsState>()((set) => ({
  system: "metric",
  types: {
    speed: "m/s",
    altitude: "km",
    power: "kW",
  },
  setSystem: (value) => set((state) => ({ system: value })),
  setSpeed: (value) =>
    set(
      produce((state) => {
        state.types.speed = value;
      })
    ),
    setPower: (value) =>
      set(
        produce((state) => {
          state.types.power = value;
        })
      ),
  setAltitude: (value) =>
    set(
      produce((state) => {
        state.types.altitude = value;
      })
    ),
}));
