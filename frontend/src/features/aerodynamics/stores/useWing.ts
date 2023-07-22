import { create } from "zustand";

interface WingState {
  chord: number;
  chordTip: number;
  tipX: number;
  span: number;
  isRectangular: boolean;
  setChord: (value: number) => void;
  setChordTip: (value: number) => void;
  setTipX: (value: number) => void;
  setSpan: (value: number) => void;
}

export const useWingStore = create<WingState>()((set) => ({
  chord: 2,
  chordTip: 1,
  tipX: 0.5,
  span: 8,
  isRectangular: true,
  setChord: (value) => set((state) => ({ chord: value })),
  setChordTip: (value) => set((state) => ({ chordTip: value })),
  setTipX: (value) => set((state) => ({ tipX: value })),
  setSpan: (value) => set((state) => ({ span: value })),
}));
