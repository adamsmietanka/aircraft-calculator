import { create } from "zustand";

export interface ClickState {
  next: boolean;
  counter: number;
  continueAnimation: () => void;
  wait: () => void;
  increaseCounter: () => void;
}

export const useAwaitClickStore = create<ClickState>()((set) => ({
  next: false,
  counter: 0,
  continueAnimation: () => set({ next: true }),
  wait: () => set({ next: false }),
  increaseCounter: () => set((state) => ({ counter: state.counter + 1 })),
}));
