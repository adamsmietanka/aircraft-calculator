import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IntroductionState {
  profile: string;
  hoverPlane: boolean;
  hoverA: boolean;
  hoverB: boolean;
  hoverC: boolean;
  setProfile: (value: string) => void;
  setHoverPlane: (value: boolean) => void;
  setHoverA: (value: boolean) => void;
  setHoverB: (value: boolean) => void;
  setHoverC: (value: boolean) => void;
  set: (value: Partial<IntroductionState>) => void;
}

export const useIntroductionStore = create<IntroductionState>()((set) => ({
  profile: "2412",
  hoverPlane: false,
  hoverA: false,
  hoverB: false,
  hoverC: false,
  setProfile: (value) => set({ profile: value }),
  setHoverPlane: (value) => set({ hoverPlane: value }),
  setHoverA: (value) => set({ hoverA: value }),
  setHoverB: (value) => set({ hoverB: value }),
  setHoverC: (value) => set({ hoverC: value }),
  set: (value) => set(value),
}));
