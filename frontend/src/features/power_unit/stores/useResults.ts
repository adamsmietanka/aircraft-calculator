import create from "zustand";

interface ResultsState {
  altitude: number;
  step: number;
  points: number;
  setAltitude: (value: number) => void;
  setStep: (value: number) => void;
  setPoints: (value: number) => void;
}

export const useResultsStore = create<ResultsState>()((set) => ({
  altitude: 0,
  step: 5,
  points: 20,
  setAltitude: (value) => set((state) => ({ altitude: value })),
  setStep: (value) => set((state) => ({ step: value })),
  setPoints: (value) => set((state) => ({ points: value })),
}));
