import { create } from "zustand";

export interface PlaneState {
  configuration: number;
  fuselage: number;
  setConfiguration: (value: number) => void;
  setFuselage: (value: number) => void;
  set: (value: Partial<PlaneState>) => void;
}

export const usePlaneStore = create<PlaneState>()((set) => ({
  configuration: 0,
  fuselage: 2303,
  setConfiguration: (value) => set({ configuration: value }),
  setFuselage: (value) => set({ fuselage: value }),
  set: (value) => set(value),
}));
