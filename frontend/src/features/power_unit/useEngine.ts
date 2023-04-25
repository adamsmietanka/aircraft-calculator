import create from "zustand";

interface EngineState {
  seaLevelPower: number;
  engineSpeed: number;
  reductionRatio: number;
  maxAltitude: number;
  kCoefficient: number;
  heights: number[];
  setSeaLevelPower: (value: number) => void;
  setEngineSpeed: (value: number) => void;
  setReductionRatio: (value: number) => void;
  setMaxAltitude: (value: number) => void;
  setKCoefficient: (value: number) => void;
}

export const useEngineStore = create<EngineState>()((set) => ({
  seaLevelPower: 1000,
  engineSpeed: 3000,
  reductionRatio: 0.4,
  maxAltitude: 10,
  kCoefficient: 0.1,
  heights: [0, 10],
  setSeaLevelPower: (value) => set((state) => ({ seaLevelPower: value })),
  setEngineSpeed: (value) => set((state) => ({ engineSpeed: value })),
  setReductionRatio: (value) => set((state) => ({ reductionRatio: value })),
  setMaxAltitude: (value) =>
    set((state) => ({
      maxAltitude: value,
      heights: Array.from(Array(value).keys()),
    })),
    setKCoefficient: (value) => set((state) => ({ kCoefficient: value })),
}));
