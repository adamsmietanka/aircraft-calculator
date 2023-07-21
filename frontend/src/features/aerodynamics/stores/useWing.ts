import { create } from "zustand";

interface WingState {
  chord: number;
  span: number;
  isRectangular: boolean;
  setChord: (value: number) => void;
  setSpan: (value: number) => void;
}

export const useWingStore = create<WingState>()((set) => ({
  chord: 1,
  span: 8,
  isRectangular: true,
  setChord: (value) => set((state) => ({ chord: value })),
  setSpan: (value) => set((state) => ({ span: value })),
}));
