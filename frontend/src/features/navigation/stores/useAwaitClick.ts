import { create } from "zustand";

export interface ClickState {
  next: boolean;
  continueAnimation: () => void;
  wait: () => void;
}

export const useAwaitClickStore = create<ClickState>()((set) => ({
  next: false,
  continueAnimation: () => set({ next: true }),
  wait: () => set({ next: false }),
}));
