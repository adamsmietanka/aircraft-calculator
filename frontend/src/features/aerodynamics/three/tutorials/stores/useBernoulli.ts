import { create } from "zustand";

export interface BernoulliState {
  show: boolean;
  potential: boolean;
  speedUp: boolean;
  set: (value: Partial<BernoulliState>) => void;
}

export const useBernoulliStore = create<BernoulliState>()((set) => ({
  show: false,
  potential: true,
  speedUp: false,
  set: (value) => set(value),
}));
