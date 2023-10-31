import { create } from "zustand";

export interface SubtitleState {
  subtitle: string | React.ReactNode;
  visible: boolean;
  setSub: (value: string | React.ReactNode) => void;
  show: () => void;
  hide: () => void;
  set: (value: Partial<SubtitleState>) => void;
}

export const useSubtitleStore = create<SubtitleState>()((set) => ({
  subtitle: null,
  visible: false,
  setSub: (value) => set({ subtitle: value }),
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
  set: (value) => set(value),
}));
