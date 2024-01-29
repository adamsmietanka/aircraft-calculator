import { create } from "zustand";

interface PlaneState {
  cl: number[][];
  clHorizontal: number[][];
  k: number[][];
  cd: number[][];
  cdFuse: number[][];
  cdVertical: number[][];
  cdHorizontal: number[][];
  monotonic: number[][];
  monotonicHorizontal: number[][];
  reversed: number[][];
  reversedFuse: number[][];
  reversedVertical: number[][];
  reversedHorizontal: number[][];
  set: (value: Partial<PlaneState>) => void;
}

export const usePlaneCoefficientsStore = create<PlaneState>()((set) => ({
  cl: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  clHorizontal: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  k: [
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
  cdHorizontal: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  monotonic: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  monotonicHorizontal: [
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
  reversedHorizontal: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  set: (value) => set(value),
}));
