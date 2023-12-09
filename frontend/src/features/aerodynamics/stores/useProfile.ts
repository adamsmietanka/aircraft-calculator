import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProfileState {
  profile: number[][];
  upper: number[][];
  lower: number[][];
  chord: number[][];
  upperFlat: number[][];
  lowerFlat: number[][];
  maxThickness: number;
  lowestPoint: number;
  highestPoint: number;
  set: (value: Partial<ProfileState>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: [],
      upper: [],
      lower: [],
      chord: [],
      upperFlat: [],
      lowerFlat: [],
      maxThickness: 0,
      lowestPoint: 0,
      highestPoint: 0,
      set: (value) => set(value),
    }),
    { name: "Profile" }
  )
);
