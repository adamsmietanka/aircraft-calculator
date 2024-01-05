import { create } from "zustand";

export interface CompassState {
  timedelta: number;
  ACdelta: number;
  A: Record<string, number>;
  B: Record<string, number>;
  C: Record<string, number>;
  helpers: boolean;
  setTimedelta: (value: number) => void;
  setACdelta: (value: number) => void;
  setHelpers: (value: boolean) => void;
  set: (value: Partial<CompassState>) => void;
}

export const useCompassStore = create<CompassState>()((set) => ({
  timedelta: 1,
  ACdelta: 1,
  A: { x: -1, y: -1 },
  B: { x: 1, y: -1 },
  C: { x: -1, y: 1 },
  helpers: true,
  setTimedelta: (value) => set({ timedelta: value }),
  setACdelta: (value) => set({ ACdelta: value }),
  setHelpers: (value) => set({ helpers: value }),
  set: (value) => set(value),
}));
