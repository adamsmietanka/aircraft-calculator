import {create} from "zustand";

interface GlobalUnitsState {
  type: string;
  speed: string;
  setType: (value: string) => void;
  setSpeed: (value: string) => void;
}

export const useGlobalUnitsStore = create<GlobalUnitsState>()((set) => ({
  type: "metric",
  speed: "m/s",
  setType: (value) => set((state) => ({ type: value })),
  setSpeed: (value) => set((state) => ({ speed: value })),
}));
