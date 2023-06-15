import { create } from "zustand";

interface TurbochargerState {
  enabled: boolean;
  endAltitude: number;
  setEnabled: (value: boolean) => void;
  setEndAltitude: (value: number) => void;
}

export const useTurbochargerStore = create<TurbochargerState>()((set) => ({
  enabled: false,
  endAltitude: 8,
  setEnabled: (value) => set((state) => ({ enabled: value })),
  setEndAltitude: (value) => set((state) => ({ endAltitude: value })),
}));
