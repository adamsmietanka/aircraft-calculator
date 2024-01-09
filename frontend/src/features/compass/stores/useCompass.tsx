import { create } from "zustand";

export interface CompassState {
  timedelta: number;
  ACdelta: number;
  A: Record<string, number>;
  B: Record<string, number>;
  C: Record<string, number>;
  x: number;
  y: number;
  phi1: number;
  phi2: number;
  helpers: boolean;
  counter: number;
  setTimedelta: (value: number) => void;
  setACdelta: (value: number) => void;
  setHelpers: (value: boolean) => void;
  increaseCounter: () => void;
  set: (value: Partial<CompassState>) => void;
}

export const useCompassStore = create<CompassState>()((set) => ({
  timedelta: 1,
  ACdelta: 1,
  A: { x: -1, y: -1 },
  B: { x: 1, y: -1 },
  C: { x: -1, y: 1 },
  x: 0,
  y: 0,
  phi1: 0,
  phi2: 0,
  helpers: true,
  counter: 0,
  setTimedelta: (value) => set({ timedelta: value }),
  setACdelta: (value) => set({ ACdelta: value }),
  setHelpers: (value) => set({ helpers: value }),
  increaseCounter: () =>
    set((state) => ({
      counter: state.counter + 1,
    })),
  set: (value) => set(value),
}));
