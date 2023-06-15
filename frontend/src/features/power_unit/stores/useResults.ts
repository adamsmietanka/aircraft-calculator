import { create } from "zustand";

export interface TableRow {
  v: number;
  j: number;
  cp: number;
  angle: number;
  eff: number;
  prop_power: number;
}

interface ResultsState {
  altitude: number;
  step: number;
  points: number;
  cpMarkers: number[][];
  effMarkers: number[][];
  table: TableRow[];
  setAltitude: (value: number) => void;
  setStep: (value: number) => void;
  setPoints: (value: number) => void;
  setCpMarkers: (value: number[][]) => void;
  setEffMarkers: (value: number[][]) => void;
  setTable: (value: TableRow[]) => void;
}

export const useResultsStore = create<ResultsState>()((set) => ({
  altitude: 0,
  step: 5,
  points: 10,
  cpMarkers: [],
  effMarkers: [],
  table: [],
  setAltitude: (value) => set((state) => ({ altitude: value })),
  setStep: (value) => set((state) => ({ step: value })),
  setPoints: (value) => set((state) => ({ points: value })),
  setCpMarkers: (value) => set((state) => ({ cpMarkers: value })),
  setEffMarkers: (value) => set((state) => ({ effMarkers: value })),
  setTable: (value) => set((state) => ({ table: value })),
}));
