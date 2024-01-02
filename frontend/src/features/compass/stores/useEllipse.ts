import { create } from "zustand";

export interface EllipseState {
  timedelta: number;
  ACdelta: number;
  A: Record<string, number>;
  B: Record<string, number>;
  C: Record<string, number>;
  helpers: boolean;
  setTimedelta: (value: number) => void;
  setACdelta: (value: number) => void;
  setHelpers: (value: boolean) => void;
  set: (value: Partial<EllipseState>) => void;
}

export const useEllipseStore = create<EllipseState>()((set) => ({
  timedelta: 4.1,
  ACdelta: 4.1,
  A: { x: -1, y: 0 },
  B: { x: 1, y: 0 },
  C: { x: -1, y: 2 },
  helpers: true,
  setTimedelta: (value) => set({ timedelta: value }),
  setACdelta: (value) => set({ ACdelta: value }),
  setHelpers: (value) => set({ helpers: value }),
  set: (value) => set(value),
}));
