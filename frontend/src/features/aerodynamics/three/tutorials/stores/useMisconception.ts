import { create } from "zustand";

export interface MisconceptionState {
  show: boolean;
  swap: boolean;
  constant: boolean;
  bigger: boolean;
  error: boolean;
  set: (value: Partial<MisconceptionState>) => void;
}

export const useMisconceptionStore = create<MisconceptionState>()((set) => ({
  show: false,
  swap: false,
  constant: false,
  bigger: false,
  error: false,
  set: (value) => set(value),
}));
