import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NUMBER_OF_AIRFOIL_SEGMENTS } from "../../common/three/config";

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
      profile: [...new Array(2 * NUMBER_OF_AIRFOIL_SEGMENTS + 2)].map(() => [
        0, 0, 0,
      ]),
      upper: [
        [0, 0, 0],
        [1, 1, 1],
      ],
      lower: [
        [0, 0, 0],
        [1, 1, 1],
      ],
      chord: [
        [0, 0, 0],
        [1, 1, 1],
      ],
      upperFlat: [
        [0, 0, 0],
        [1, 1, 1],
      ],
      lowerFlat: [
        [0, 0, 0],
        [1, 1, 1],
      ],
      maxThickness: 0,
      lowestPoint: 0,
      highestPoint: 0,
      set: (value) => set(value),
    }),
    { name: "Profile" }
  )
);
