import { create } from "zustand";

export interface AnimationState {
  counter: number;
  subtitle: string | React.ReactNode;
  visible: boolean;
  slowdown: boolean;
  duration: number;
  inAnimation: boolean;
  increaseCounter: () => void;
  setSub: (value: string | React.ReactNode) => void;
  setInAnimation: (value: boolean) => void;
  show: () => void;
  hide: () => void;
  set: (value: Partial<AnimationState>) => void;
}

export const useAnimationStore = create<AnimationState>()((set) => ({
  counter: 0,
  subtitle: null,
  visible: false,
  slowdown: false,
  duration: 2,
  inAnimation: false,
  increaseCounter: () => set((state) => ({ counter: state.counter + 1 })),
  setSub: (value) => set({ subtitle: value }),
  setInAnimation: (value) => set({ inAnimation: value }),
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
  set: (value) => set(value),
}));
