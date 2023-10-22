import { create } from "zustand";

export interface CompassState {
  timedelta: number;
  setTimedelta: (value: number) => void;
  set: (value: Partial<CompassState>) => void;
}

export const useCompassStore = create<CompassState>()((set) => ({
  timedelta: 0,
  setTimedelta: (value) => set({ timedelta: value }),
  set: (value) => set(value),
}));
