import create from "zustand";

export interface TableRow {
  v: number;
  j: number;
  angle: number;
  eff: number;
  prop_power: number;
}

interface ResultsState {
  altitude: number;
  step: number;
  points: number;
  cpMarkers: Float32Array;
  effMarkers: Float32Array;
  table: TableRow[];
  setAltitude: (value: number) => void;
  setStep: (value: number) => void;
  setPoints: (value: number) => void;
  setCpMarkers: (value: Float32Array) => void;
  setEffMarkers: (value: Float32Array) => void;
  setTable: (value: TableRow[]) => void;
}

export const useResultsStore = create<ResultsState>()((set) => ({
  altitude: 0,
  step: 5,
  points: 10,
  cpMarkers: new Float32Array(),
  effMarkers: new Float32Array(),
  table: [],
  setAltitude: (value) => set((state) => ({ altitude: value })),
  setStep: (value) => set((state) => ({ step: value })),
  setPoints: (value) => set((state) => ({ points: value })),
  setCpMarkers: (value) => set((state) => ({ cpMarkers: value })),
  setEffMarkers: (value) => set((state) => ({ effMarkers: value })),
  setTable: (value) => set((state) => ({ table: value })),
}));
