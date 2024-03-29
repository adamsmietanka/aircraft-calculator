import { create } from "zustand";

interface ProfileState {
  cl: number[][];
  cd: number[][];
  monotonic: number[][];
  reversed: number[][];
  set: (value: Partial<ProfileState>) => void;
}

export const useProfileCoefficientsStore = create<ProfileState>()((set) => ({
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
  monotonic: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  reversed: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  set: (value) => set(value),
}));
