import { create } from "zustand";

export interface PlaneState {
  configuration: number;
  setConfiguration: (value: number) => void;
  set: (value: Partial<PlaneState>) => void;
}

export const usePlaneStore = create<PlaneState>()((set) => ({
  configuration: 1,
  setConfiguration: (value) => set({ configuration: value }),
  set: (value) => set(value),
}));
