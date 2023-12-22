import { create } from "zustand";

export interface SubtitleState {
  subtitle: string | React.ReactNode;
  visible: boolean;
  slowdown: boolean;
  duration: number;
  inAnimation: boolean;
  setSub: (value: string | React.ReactNode) => void;
  setInAnimation: (value: boolean) => void;
  show: () => void;
  hide: () => void;
  set: (value: Partial<SubtitleState>) => void;
}

export const useSubtitleStore = create<SubtitleState>()((set) => ({
  subtitle: null,
  visible: false,
  slowdown: false,
  duration: 2,
  inAnimation: false,
  setSub: (value) => set({ subtitle: value }),
  setInAnimation: (value) => set({ inAnimation: value }),
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
  set: (value) => set(value),
}));
