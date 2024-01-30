import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PlaneState {
  configuration: number;
  fuselage: number;
  fuselageDistance: number;
  length: number;
  wingX: number;
  verticalToTail: number;
  verticalX: number;
  verticalY: number;
  horizontalX: number;
  horizontalY: number;
  fuseLatch: boolean;
  measurements: boolean;
  kMax: number;
  angleOpt: number;
  setConfiguration: (value: number) => void;
  setFuselage: (value: number) => void;
  setFuselageDistance: (value: number) => void;
  setLength: (value: number) => void;
  setWingX: (value: number) => void;
  setVerticalToTail: (value: number) => void;
  setMeasurements: (value: boolean) => void;
  set: (value: Partial<PlaneState>) => void;
}

export const usePlaneStore = create<PlaneState>()(
  persist(
    (set) => ({
      configuration: 0,
      fuselage: 2303,
      fuselageDistance: 6,
      length: 9,
      wingX: 1.5,
      verticalToTail: 1.3,
      verticalX: 1.3,
      verticalY: 1.3,
      horizontalX: 1.3,
      horizontalY: 1.3,
      fuseLatch: false,
      measurements: true,
      kMax: 10,
      angleOpt: 10,
      setConfiguration: (value) => set({ configuration: value }),
      setFuselage: (value) =>
        set((state) => ({ fuselage: value, fuseLatch: !state.fuseLatch })),
      setFuselageDistance: (value) => set({ fuselageDistance: value }),
      setLength: (value) => set({ length: value }),
      setWingX: (value) => set({ wingX: value }),
      setVerticalToTail: (value) => set({ verticalToTail: value }),
      setMeasurements: (value) => set({ measurements: value }),
      set: (value) => set(value),
    }),
    { name: "Plane" }
  )
);
