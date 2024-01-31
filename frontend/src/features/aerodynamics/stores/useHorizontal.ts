import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StabilizerState {
  chord: number;
  chordTip: number;
  span: number;
  angle: number;
  profile: string;
  shape: number;
  //aerodynamics
  area: number;
  aspectRatio: number;
  taperRatio: number;
  MAC: number;
  MACposition: number[];
  stallReynolds: number;
  kH: number;
  lever: number;
  position: number;
  setChord: (value: number) => void;
  setChordTip: (value: number) => void;
  setSpan: (value: number) => void;
  setAngle: (value: number) => void;
  setProfile: (value: string) => void;
  setShape: (value: number) => void;
  setPosition: (value: number) => void;
  set: (value: Partial<StabilizerState>) => void;
}

export const useHorizontalStore = create<StabilizerState>()(
  persist(
    (set) => ({
      chord: 1.25,
      chordTip: 0.65,
      span: 3,
      angle: 20,
      profile: "0009",
      shape: 3,
      // aerodynamics
      area: 0,
      aspectRatio: 0,
      taperRatio: 0,
      MAC: 0,
      MACposition: [0, 0],
      stallReynolds: 0,
      kH: 0.5,
      lever: 0.5,
      position: 0,
      setChord: (value) => set({ chord: value }),
      setChordTip: (value) => set({ chordTip: value }),
      setSpan: (value) => set({ span: value }),
      setAngle: (value) => set({ angle: value }),
      setProfile: (value) => set({ profile: value }),
      setShape: (value) => set({ shape: value }),
      setPosition: (value) => set({ position: value }),
      set: (value) => set(value),
    }),
    { name: "Horizontal" }
  )
);
