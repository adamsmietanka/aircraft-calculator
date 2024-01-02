import { create } from "zustand";

export interface EllipseState {
  timedelta: number;
  ACdelta: number;
  A: Record<string, number>;
  B: Record<string, number>;
  C: Record<string, number>;
  setTimedelta: (value: number) => void;
  setACdelta: (value: number) => void;
  set: (value: Partial<EllipseState>) => void;
}

export const useEllipseStore = create<EllipseState>()((set) => ({
  timedelta: 1,
  ACdelta: 1,
  A: { x: -1, y: 0 },
  B: { x: 1, y: 0 },
  C: { x: -1, y: 2 },
  setTimedelta: (value) => set({ timedelta: value }),
  setACdelta: (value) => set({ ACdelta: value }),
  set: (value) => set(value),
}));
