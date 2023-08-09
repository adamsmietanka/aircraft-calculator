import { create } from "zustand";

export interface WingState {
  chord: number;
  chordTip: number;
  tipX: number;
  span: number;
  angle: number;
  isRectangular: boolean;
  profile: string;
  reynolds: number;
  setChord: (value: number) => void;
  setChordTip: (value: number) => void;
  setTipX: (value: number) => void;
  setSpan: (value: number) => void;
  setAngle: (value: number) => void;
  setProfile: (value: string) => void;
  setReynolds: (value: number) => void;
  set: (value: Partial<WingState>) => void;
}

export const useWingStore = create<WingState>()((set) => ({
  chord: 2,
  chordTip: 1,
  tipX: 0.5,
  span: 8,
  angle: 15,
  isRectangular: true,
  profile: "2412",
  reynolds: 0,
  setChord: (value) => set({ chord: value }),
  setChordTip: (value) => set({ chordTip: value }),
  setTipX: (value) => set({ tipX: value }),
  setSpan: (value) => set({ span: value }),
  setAngle: (value) => set({ angle: value }),
  setProfile: (value) => set({ profile: value }),
  setReynolds: (value) => set({ reynolds: value }),
  set: (value) => set(value),
}));
