import { create } from "zustand";

export interface NewtonState {
  show: boolean;
  velocity: boolean;
  force: boolean;
  acceleration: boolean;
  set: (value: Partial<NewtonState>) => void;
}

export const useNewtonStore = create<NewtonState>()((set) => ({
  show: false,
  velocity: true,
  force: false,
  acceleration: false,
  set: (value) => set(value),
}));
