import { create } from "zustand";
// import { persist } from "zustand/middleware";

interface ProfileState {
  cl: number[][];
  cd: number[][];
  monotonic: number[][];
  reversed: number[][];
  set: (value: Partial<ProfileState>) => void;
}

export const useProfileCoefficientsStore = create<ProfileState>()(
  // persist(
  (set) => ({
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
  })
  // { name: "ProfileCoeffs" }
  // )
);
