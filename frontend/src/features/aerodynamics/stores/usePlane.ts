import { create } from "zustand";

export interface PlaneState {
  configuration: number;
  fuselage: number;
  fuseLatch: boolean;
  setConfiguration: (value: number) => void;
  setFuselage: (value: number) => void;
  set: (value: Partial<PlaneState>) => void;
}

export const usePlaneStore = create<PlaneState>()((set) => ({
  configuration: 0,
  fuselage: 2304,
  fuseLatch: false,
  setConfiguration: (value) => set({ configuration: value }),
  setFuselage: (value) =>
    set((state) => ({ fuselage: value, fuseLatch: !state.fuseLatch })),
  set: (value) => set(value),
}));
