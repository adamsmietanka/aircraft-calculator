import { create } from "zustand";

export interface EllipseState {
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
  setTimedelta: (value: number) => void;
  setACdelta: (value: number) => void;
  setHelpers: (value: boolean) => void;
  set: (value: Partial<EllipseState>) => void;
}

export const useEllipseStore = create<EllipseState>()((set) => ({
  timedelta: 4.1,
  ACdelta: 4.1,
  A: { x: -1, y: -1 },
  B: { x: 1, y: -1 },
  C: { x: -1, y: 1 },
  x: 0,
  y: 0,
  phi1: 0,
  phi2: 0,
  helpers: true,
  setTimedelta: (value) => set({ timedelta: value }),
  setACdelta: (value) => set({ ACdelta: value }),
  setHelpers: (value) => set({ helpers: value }),
  set: (value) => set(value),
}));
