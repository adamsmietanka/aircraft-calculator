import create from "zustand";

interface SteerState {
  x_h: number;
  speedDifference: number;
  sh: number;

  steerReynoldsNumber: number;
  steerMachNumber: number;
  steerProfileThickess: number;
  steerProfileyc90: number;
  steerProfileyc99: number;
  o25clineIncilnation: number;
  steerAspectRatio: number;
  steerZbieznosc: number;

  setX_h: (value: number) => void;
  setSpeedDifference: (value: number) => void;
  setSh: (value: number) => void;

  setSteerReynoldsNumber: (value: number) => void;
  setSteerMachNumber: (value: number) => void;
  setSteerProfileThickess: (value: number) => void;
  setSteerProfileyc90: (value: number) => void;
  setSteerProfileyc99: (value: number) => void;
  setSteero25clineInclination: (value: number) => void;
  setSteerAspectRatio: (value: number) => void;
  setsteerzbieznosc: (value: number) => void;
}

export const useSteerStore = create<SteerState>()((set) => ({
  x_h: 10,
  speedDifference: 0.98,
  sh: 3.78,

  steerReynoldsNumber: 20000000,
  steerMachNumber: 0.5,
  steerProfileThickess: 0.2,
  steerProfileyc90: 0.1,
  steerProfileyc99: 0.01,
  o25clineIncilnation: 20,
  steerAspectRatio: 1,
  steerZbieznosc: 0.5,

  setX_h: (value) => set((state) => ({ x_h: value })),
  setSpeedDifference: (value) => set((state) => ({ speedDifference: value })),
  setSh: (value) => set((state) => ({ sh: value })),

  setSteerReynoldsNumber: (value) =>
    set((state) => ({ steerReynoldsNumber: value })),
    
  setSteerMachNumber: (value) =>
  set((state) => ({ steerMachNumber: value })),
  setSteerProfileThickess: (value) =>
    set((state) => ({ steerProfileThickess: value })),
  setSteerProfileyc90: (value) => set((state) => ({ steerProfileyc90: value })),
  setSteerProfileyc99: (value) => set((state) => ({ steerProfileyc99: value })),
  setSteero25clineInclination: (value) =>
    set((state) => ({ o25clineIncilnation: value })),
  setSteerAspectRatio: (value) => set((state) => ({ steerAspectRatio: value })),
  setsteerzbieznosc: (value) => set((state) => ({ steerZbieznosc: value })),
}));

interface SteerOutputState {
  kappa: number;
  a1: number;
  a2: number;
  setKappa: (value: number) => void;
  setA1: (value: number) => void;
  setA2: (value: number) => void;
}

export const useSteerOutputStore = create<SteerOutputState>()((set) => ({
  kappa: 10,
  a1: 2.14,
  a2: 2,
  setKappa: (value) => set((state) => ({ kappa: value })),
  setA1: (value) => set((state) => ({ a1: value })),
  setA2: (value) => set((state) => ({ a2: value })),
}));
