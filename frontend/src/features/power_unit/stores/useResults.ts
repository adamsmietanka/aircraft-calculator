import create from "zustand";

interface ResultsState {
  altitude: number;
  step: number;
  points: number;
  cpMarkers: Float32Array;
  setAltitude: (value: number) => void;
  setStep: (value: number) => void;
  setPoints: (value: number) => void;
  setCpMarkers: (value: Float32Array) => void;
}

export const useResultsStore = create<ResultsState>()((set) => ({
  altitude: 0,
  step: 5,
  points: 10,
  cpMarkers: new Float32Array(),
  setAltitude: (value) => set((state) => ({ altitude: value })),
  setStep: (value) => set((state) => ({ step: value })),
  setPoints: (value) => set((state) => ({ points: value })),
  setCpMarkers: (value) => set((state) => ({ cpMarkers: value })),
}));
