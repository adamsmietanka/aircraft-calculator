import { produce } from "immer";
import { create } from "zustand";

interface GlobalUnitsState {
  system: string;
  types: Record<string, string>;
  setSystem: (value: string) => void;
  setAltitude: (value: string) => void;
  setLength: (value: string) => void;
  setArea: (value: string) => void;
  setSpeed: (value: string) => void;
  setPower: (value: string) => void;
}

export const useGlobalUnitsStore = create<GlobalUnitsState>()((set) => ({
  system: "metric",
  types: {
    altitude: "km",
    length: "m",
    area: "m2",
    speed: "m/s",
    power: "kW",
  },
  setSystem: (value) => set((state) => ({ system: value })),
  setAltitude: (value) =>
    set(
      produce((state) => {
        state.types.altitude = value;
      })
    ),
  setLength: (value) =>
    set(
      produce((state) => {
        state.types.length = value;
      })
    ),
  setArea: (value) =>
    set(
      produce((state) => {
        state.types.area = value;
      })
    ),
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
}));
