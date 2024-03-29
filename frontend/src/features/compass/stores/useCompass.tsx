import { create } from "zustand";

export interface CompassState {
  timedelta: number;
  ACdelta: number;
  A: { x: number; y: number };
  B: { x: number; y: number };
  C: { x: number; y: number };
  x: number;
  y: number;
  phi1: number;
  phi2: number;
  helpers: boolean;
  directrix: boolean;
  distances: boolean;
  counter: number;
  DOP: number;
  setTimedelta: (value: number) => void;
  setACdelta: (value: number) => void;
  setDOP: (value: number) => void;
  setHelpers: (value: boolean) => void;
  setDirectrix: (value: boolean) => void;
  setDistances: (value: boolean) => void;
  increaseCounter: () => void;
  set: (value: Partial<CompassState>) => void;
}

export const useCompassStore = create<CompassState>()((set) => ({
  timedelta: -50,
  ACdelta: -10,
  A: { x: -1, y: -1 },
  B: { x: 1, y: -1 },
  C: { x: -1, y: 1 },
  x: 0,
  y: 0,
  phi1: 0,
  phi2: 0,
  helpers: false,
  directrix: false,
  distances: false,
  counter: 0,
  DOP: 0,
  setTimedelta: (value) => set({ timedelta: value }),
  setACdelta: (value) => set({ ACdelta: value }),
  setDOP: (value) => set({ DOP: value }),
  setHelpers: (value) => set({ helpers: value }),
  setDirectrix: (value) => set({ directrix: value }),
  setDistances: (value) => set({ distances: value }),
  increaseCounter: () =>
    set((state) => ({
      counter: state.counter + 1,
    })),
  set: (value) => set(value),
}));
