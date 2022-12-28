import create from "zustand";

interface SteerState {
  x_h: number;
  speedDifference: number;
  sh:number;
  setX_h: (value: number) => void;
  setSpeedDifference: (value: number) => void;
  setSh: (value: number) => void;
}

export const useSteerStore = create<SteerState>()((set) => ({
  x_h: 10,
  speedDifference: 0.98,
  sh:3.78,
  setX_h: (value) => set((state) => ({ x_h: value })),
  setSpeedDifference: (value) => set((state) => ({ speedDifference: value })),
  setSh:(value) => set((state) => ({ sh: value }))
}));

interface SteerOutputState {
  kappa: number;
  setKappa: (value: number) => void;
}

export const useSteerOutputStore = create<SteerOutputState>()((set) => ({
  kappa: 10,
  setKappa: (value) => set((state) => ({ kappa: value })),
}));
