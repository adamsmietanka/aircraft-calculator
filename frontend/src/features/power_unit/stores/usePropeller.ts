import create from "zustand";

interface PropellerState {
  cruiseSpeed: number;
  cruiseAltitude: number;
  setSpeed: (value: number) => void;
  setAltitude: (value: number) => void;
}

export const usePropellerStore = create<PropellerState>()((set) => ({
  cruiseSpeed: 150,
  cruiseAltitude: 3,
  setSpeed: (value) => set((state) => ({ cruiseSpeed: value })),
  setAltitude: (value) => set((state) => ({ cruiseAltitude: value })),
}));
