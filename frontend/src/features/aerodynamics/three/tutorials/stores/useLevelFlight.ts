import { create } from "zustand";

export interface LevelFlightState {
  show: boolean;
  expand: boolean;
  rearrange: boolean;
  set: (value: Partial<LevelFlightState>) => void;
}

export const useLevelFlightStore = create<LevelFlightState>()((set) => ({
  show: false,
  expand: false,
  rearrange: false,
  set: (value) => set(value),
}));
