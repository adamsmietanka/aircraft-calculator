import { create } from "zustand";

export const createHeightsArray = (maxHeight: number, step = 0.2) =>
  Array.from(Array(maxHeight / step + 1).keys()).map((h) => h * step);

interface EngineState {
  seaLevelPower: number;
  engineSpeed: number;
  reductionRatio: number;
  maxAltitude: number;
  kCoefficient: number;
  heights: number[];
  superchargerEnabled: boolean;
  setSeaLevelPower: (value: number) => void;
  setEngineSpeed: (value: number) => void;
  setReductionRatio: (value: number) => void;
  setMaxAltitude: (value: number) => void;
  setKCoefficient: (value: number) => void;
  setHeights: (value: number[]) => void;
  setSuperchargerEnabled: (value: boolean) => void;
}

export const useEngineStore = create<EngineState>()((set) => ({
  seaLevelPower: 800,
  engineSpeed: 3000,
  reductionRatio: 0.4,
  maxAltitude: 10,
  kCoefficient: 0.1,
  heights: createHeightsArray(10),
  superchargerEnabled: false,
  setSeaLevelPower: (value) => set((state) => ({ seaLevelPower: value })),
  setEngineSpeed: (value) => set((state) => ({ engineSpeed: value })),
  setReductionRatio: (value) => set((state) => ({ reductionRatio: value })),
  setMaxAltitude: (value) =>
    set((state) => ({
      maxAltitude: value,
      heights: createHeightsArray(value),
    })),

  setKCoefficient: (value) => set((state) => ({ kCoefficient: value })),
  setHeights: (value) => set((state) => ({ heights: value })),
  setSuperchargerEnabled: (value) =>
    set((state) => ({ superchargerEnabled: value })),
}));
