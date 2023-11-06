import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WingState {
  chord: number;
  chordTip: number;
  tipX: number;
  span: number;
  angle: number;
  isRectangular: boolean;
  profile: string;
  reynoldsIndex: number;
  reynolds: number;
  stallVelocity: number;
  material: number;
  shape: number;
  setChord: (value: number) => void;
  setChordTip: (value: number) => void;
  setTipX: (value: number) => void;
  setSpan: (value: number) => void;
  setAngle: (value: number) => void;
  setProfile: (value: string) => void;
  setReynoldsIndex: (value: number) => void;
  setReynolds: (value: number) => void;
  setStallVelocity: (value: number) => void;
  setMaterial: (value: number) => void;
  setShape: (value: number) => void;
  set: (value: Partial<WingState>) => void;
}

export const useWingStore = create<WingState>()(
  persist(
    (set) => ({
      chord: 2,
      chordTip: 1.14,
      tipX: 0.5,
      span: 12,
      angle: 15,
      isRectangular: true,
      profile: "2412",
      reynoldsIndex: 1,
      reynolds: 3,
      stallVelocity: 30,
      material: 0,
      shape: 1,
      setChord: (value) => set({ chord: value }),
      setChordTip: (value) => set({ chordTip: value }),
      setTipX: (value) => set({ tipX: value }),
      setSpan: (value) => set({ span: value }),
      setAngle: (value) => set({ angle: value }),
      setProfile: (value) => set({ profile: value }),
      setReynoldsIndex: (value) => set({ reynoldsIndex: value }),
      setReynolds: (value) => set({ reynolds: value }),
      setStallVelocity: (value) => set({ stallVelocity: value }),
      setMaterial: (value) => set({ material: value }),
      setShape: (value) => set({ shape: value }),
      set: (value) => set(value),
    }),
    { name: "Wing" }
  )
);
