import create from "zustand";

interface SteerState {
  x_h: number;
  speedDifference: number;
  sh: number;

  steerReynoldsNumber: number;
  steerMachNumber: number;
  o25clineIncilnation: number;
  steerAspectRatio: number;
  steerZbieznosc: number;
  profile: string;
  steerOuterSpan: number,
  steerInnerSpan: number,
  stabillzerSpan: number,
  steerToStabillizerCordRatio:number

  wingAspectRatio: number;
  a: number;

  cruiseVelocity: number;
  cruiseAlttiude: number;
  mass: number;

  setX_h: (value: number) => void;
  setSpeedDifference: (value: number) => void;
  setSh: (value: number) => void;

  setSteerReynoldsNumber: (value: number) => void;
  setSteerMachNumber: (value: number) => void;
  setSteero25clineInclination: (value: number) => void;
  setSteerAspectRatio: (value: number) => void;
  setsteerzbieznosc: (value: number) => void;
  setProfile: (value: string) => void;
  setSteerOuterSpan: (value:number)=>void;
  setSteerInnerSpan: (value:number)=>void;
  setStabillzerSpan: (value:number)=>void;
  setSteerToStabillizerCordRatio:(value:number)=>void;
  setWingAspectRatio: (value: number) => void;
  setA: (value: number) => void;

  setCruiseVelocity: (value: number) => void;
  setCruiseAlttiude: (value: number) => void;
  setMass: (value: number) => void;
}

export const useSteerStore = create<SteerState>()((set) => ({
  x_h: 10,
  speedDifference: 0.98,
  sh: 3.78,

  steerReynoldsNumber: 20000000,
  steerMachNumber: 0.5,
  o25clineIncilnation: 20,
  steerAspectRatio: 1,
  steerZbieznosc: 0.5,
  profile: "NACA0007",
  steerOuterSpan: 1,
  steerInnerSpan: 0.5,
  stabillzerSpan: 2,
  steerToStabillizerCordRatio: 0.2,

  wingAspectRatio: 5.96,
  a: 4.41,

  cruiseVelocity: 158,
  cruiseAlttiude: 8000,
  mass: 3000,

  setX_h: (value) => set((state) => ({ x_h: value })),
  setSpeedDifference: (value) => set((state) => ({ speedDifference: value })),
  setSh: (value) => set((state) => ({ sh: value })),
  setSteerReynoldsNumber: (value) =>
    set((state) => ({ steerReynoldsNumber: value })),
  setSteerMachNumber: (value) => set((state) => ({ steerMachNumber: value })),
  setSteero25clineInclination: (value) =>
    set((state) => ({ o25clineIncilnation: value })),
  setSteerAspectRatio: (value) => set((state) => ({ steerAspectRatio: value })),
  setsteerzbieznosc: (value) => set((state) => ({ steerZbieznosc: value })),
  setProfile: (value) => set((state) => ({ profile: value })),
  setSteerOuterSpan: (value)=>set ({steerOuterSpan:value}),
  setSteerInnerSpan: (value)=>set ({steerInnerSpan:value}),
  setStabillzerSpan: (value)=>set ({stabillzerSpan:value}),
  setSteerToStabillizerCordRatio:(value)=>({steerToStabillizerCordRatio:value}),

  setWingAspectRatio: (value) => set((state) => ({ wingAspectRatio: value })),
  setA: (value) => set((state) => ({ a: value })),

  setCruiseVelocity: (value) => set((state) => ({ cruiseVelocity: value })),
  setCruiseAlttiude: (value) => set((state) => ({ cruiseAlttiude: value })),
  setMass: (value) => set((state) => ({ mass: value })),
}));

interface SteerOutputState {
  kappa: number;
  a1: number;
  a2: number;
  dEpsTodAlfa: number;
  steerInclinationAngle: number;
  delta: number[];
  alfaH: number[];
  setKappa: (value: number) => void;
  setA1: (value: number) => void;
  setA2: (value: number) => void;
  setDEpsTodAlfa: (value: number) => void;
  setSteerInclinationAngle: (value: number) => void;
  setDelta: (value: number[]) => void;
  setAlfaH: (value: number[]) => void;
}

export const useSteerOutputStore = create<SteerOutputState>()((set) => ({
  kappa: 10,
  a1: 3.2,
  a2: 1.3,
  dEpsTodAlfa: 0.47,
  steerInclinationAngle: -0.1038,
  delta: [1],
  alfaH: [],
  setKappa: (value) => set((state) => ({ kappa: value })),
  setA1: (value) => set((state) => ({ a1: value })),
  setA2: (value) => set((state) => ({ a2: value })),
  setDEpsTodAlfa: (value) => set((state) => ({ dEpsTodAlfa: value })),
  setSteerInclinationAngle: (value) =>
    set((state) => ({ steerInclinationAngle: value })),
  setDelta: (value) => set((state) => ({ delta: value })),
  setAlfaH: (value) => set((state) => ({ alfaH: value })),
}));
