import create from "zustand";

interface PropellerState {
  cruiseSpeed: number;
  cruiseAltitude: number;
  blades: number;
  variable: boolean;
  angle: number;
  setSpeed: (value: number) => void;
  setAltitude: (value: number) => void;
  setBlades: (value: number) => void;
  setVariable: (value: boolean) => void;
  setAngle: (value: number) => void;
}

export const usePropellerStore = create<PropellerState>()((set) => ({
  cruiseSpeed: 150,
  cruiseAltitude: 3,
  blades: 3,
  variable: true,
  angle: 30,
  setSpeed: (value) => set((state) => ({ cruiseSpeed: value })),
  setAltitude: (value) => set((state) => ({ cruiseAltitude: value })),
  setBlades: (value) => set((state) => ({ blades: value })),
  setVariable: (value) => set((state) => ({ variable: value })),
  setAngle: (value) => set((state) => ({ angle: value })),
}));
