import { create } from "zustand";

interface PlaneState {
  cl: number[][];
  cd: number[][];
  cdFuse: number[][];
  cdVertical: number[][];
  monotonic: number[][];
  reversed: number[][];
  reversedFuse: number[][];
  reversedVertical: number[][];
  set: (value: Partial<PlaneState>) => void;
}

export const usePlaneCoefficientsStore = create<PlaneState>()((set) => ({
  cl: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  cd: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  cdFuse: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  cdVertical: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  monotonic: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  reversed: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  reversedFuse: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  reversedVertical: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  set: (value) => set(value),
}));
