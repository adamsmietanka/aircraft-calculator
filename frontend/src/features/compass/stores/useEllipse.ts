import { create } from "zustand";

export interface EllipseState {
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
  DOP: number;
  setTimedelta: (value: number) => void;
  setACdelta: (value: number) => void;
  setHelpers: (value: boolean) => void;
  setDOP: (value: number) => void;
  set: (value: Partial<EllipseState>) => void;
}

export const useEllipseStore = create<EllipseState>()((set) => ({
  timedelta: 40,
  ACdelta: 40,
  A: { x: -1, y: -1 },
  B: { x: 1, y: -1 },
  C: { x: -1, y: 1 },
  x: 0,
  y: 0,
  phi1: 0,
  phi2: 0,
  helpers: true,
  DOP: 0,
  setTimedelta: (value) => set({ timedelta: value }),
  setACdelta: (value) => set({ ACdelta: value }),
  setHelpers: (value) => set({ helpers: value }),
  setDOP: (value) => set({ DOP: value }),
  set: (value) => set(value),
}));
