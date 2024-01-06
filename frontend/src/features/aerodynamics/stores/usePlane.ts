import { create } from "zustand";

export interface PlaneState {
  configuration: number;
  fuselage: number;
  length: number;
  wingX: number;
  fuseLatch: boolean;
  setConfiguration: (value: number) => void;
  setFuselage: (value: number) => void;
  setLength: (value: number) => void;
  setWingX: (value: number) => void;
  set: (value: Partial<PlaneState>) => void;
}

export const usePlaneStore = create<PlaneState>()((set) => ({
  configuration: 0,
  fuselage: 2304,
  length: 9,
  wingX: 1.5,
  fuseLatch: false,
  setConfiguration: (value) => set({ configuration: value }),
  setFuselage: (value) =>
    set((state) => ({ fuselage: value, fuseLatch: !state.fuseLatch })),
  setLength: (value) => set({ length: value }),
  setWingX: (value) => set({ wingX: value }),
  set: (value) => set(value),
}));
