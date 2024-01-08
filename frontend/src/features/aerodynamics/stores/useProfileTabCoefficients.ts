import { create } from "zustand";

interface ProfileState {
  cl: number[][];
  cd: number[][];
  monotonic: number[][];
  reversed: number[][];
  set: (value: Partial<ProfileState>) => void;
}

/**
 * The charts require two different Profile points sources, because on Profile tab Reynolds number can be set manually, while it is automatically chosen everywhere else
 */
export const useProfileTabCoefficientsStore = create<ProfileState>()((set) => ({
  cl: [
    [0, 0, 0],
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
