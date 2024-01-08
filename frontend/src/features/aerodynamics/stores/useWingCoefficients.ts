import { create } from "zustand";

interface WingState {
  cl: number[][];
  cd: number[][];
  cdInduced: number[][];
  monotonic: number[][];
  reversed: number[][];
  reversedInduced: number[][];
  set: (value: Partial<WingState>) => void;
}

export const useWingCoefficientsStore = create<WingState>()((set) => ({
  cl: [
    [0, 0, 0],
    [0.33, 0.33, 0.33],
    [0.66, 0.66, 0.66],
    [1, 1, 1],
  ],
  cd: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  cdInduced: [
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
  reversedInduced: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  set: (value) => set(value),
}));
