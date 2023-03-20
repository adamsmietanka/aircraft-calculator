import create from "zustand";

interface ForceOnTheRodState {
  height: number;
  rodLenght: number;
  angularRudderToSteeringGearRatio: number;
  steerCord: number;
  velocity: number[];

  setHeight: (value: number) => void;
  setRodLenght: (value: number) => void;
  setAngularRudderToSteeringGearRatio: (value: number) => void;
  setSteerCord: (value: number) => void;
  setVelocity: (value: number[]) => void;
}

export const useForceOnTheRodStore = create<ForceOnTheRodState>()((set) => ({
  height: 7000,
  rodLenght: 1,
  angularRudderToSteeringGearRatio: 1,
  steerCord: 1.115,
  velocity: [
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170,
    180, 190, 200, 210, 220, 230,
  ],

  setHeight: (value) => set((state) => ({ height: value })),
  setRodLenght: (value) => set((state) => ({ rodLenght: value })),
  setAngularRudderToSteeringGearRatio: (value) =>
    set((state) => ({ angularRudderToSteeringGearRatio: value })),
  setSteerCord: (value) => set((state) => ({ steerCord: value })),
  setVelocity: (value) => set((state) => ({ velocity: value })),
}));

interface ForceOnTheRodOutputState {
  b1: number;
  b2: number;
  b3: number;
  deltaHk: number;
  heightSteerHingeMoment: number[];
  forceOnTheRod: number[];
  setB1: (value: number) => void;
  setB2: (value: number) => void;
  setB3: (value: number) => void;
  setHeightSteerHingeMoment: (value: number[]) => void;
  setForceOnTheRod: (value: number[]) => void;
  setDeltaHk: (value: number) => void;
}

export const useForceOnTheRodOutputStore = create<ForceOnTheRodOutputState>()(
  (set) => ({
    b1: -0.0861,
    b2: -0.2252,
    b3: -0.0296,
    deltaHk: 0.3793,
    heightSteerHingeMoment: [
      -0.0158325046201648, -0.0119373237649203, -0.000360275540258867,
      0.00816640073207815, 0.0113093080263563, 0.0183466496229789,
      0.0209449534388357, 0.0231683028677659, 0.0268157541319189,
      0.0283342023578984, 0.0301410629303375, 0.0309389801661914,
      0.0303671322084104, 0.029803409824517, 0.0295157418628634,
      0.0283623719865002, 0.0251522325586371,
    ],
    forceOnTheRod: [
      -1162.26075027061, -375.564155823604, -3.96716245885798, 58.0155209860233,
      71.1611883117251, 87.8363212703999, 88.7056451350175, 87.971385405518,
      86.8472968525178, 83.2003074203875, 80.9505706290284, 77.4280862304309,
      71.1461051324602, 64.9859966980752, 61.9069784513951, 56.7838803237614,
      46.1604992165136,
    ],
    setB1: (value) => set((state) => ({ b1: value })),
    setB2: (value) => set((state) => ({ b2: value })),
    setB3: (value) => set((state) => ({ b3: value })),
    setHeightSteerHingeMoment: (value) =>
      set((state) => ({ heightSteerHingeMoment: value })),
    setForceOnTheRod: (value) => set((state) => ({ forceOnTheRod: value })),
    setDeltaHk: (value) => set((state) => ({ deltaHk: value })),
  })
);

interface TrimState {
  rudderCord: number;
  steerSpan: number;
  steerAftHingeArea: number;
  trimSpan: number;
  trimAftHingeArea: number;
  steerNoseHingeArea: number;
  steerFwdHingeArea: number;
  setRudderCord: (value: number) => void;
  setSteerSpan: (value: number) => void;
  setAftHingeArea: (value: number) => void;
  setTrimSpan: (value: number) => void;
  setSteerNoseHingeArea: (value: number) => void;
  setSteerFwdHingeArea: (value: number) => void;
  setTrimAftHingeArea: (value: number) => void;
}

export const useTrimStore = create<TrimState>()((set) => ({
  rudderCord: 1.2,
  steerSpan: 0.0861,
  steerAftHingeArea: 0.2252,
  trimSpan: 0.0296,
  trimAftHingeArea: 0.3793,
  steerNoseHingeArea: 0.2,
  steerFwdHingeArea: 20,
  setRudderCord: (value) => set((state) => ({ rudderCord: value })),
  setSteerSpan: (value) => set((state) => ({ steerSpan: value })),
  setAftHingeArea: (value) => set((state) => ({ steerAftHingeArea: value })),
  setTrimSpan: (value) => set((state) => ({ trimSpan: value })),
  setSteerNoseHingeArea: (value) =>
    set((state) => ({ steerNoseHingeArea: value })),
  setSteerFwdHingeArea: (value) =>
    set((state) => ({ steerFwdHingeArea: value })),
  setTrimAftHingeArea: (value) => set((state) => ({ trimAftHingeArea: value })),
}));

interface TrimVelocityState {
  trimVelocity: number;
  setTrimVelocity: (value: number) => void;
}

export const useTrimVelocityStore = create<TrimVelocityState>()((set) => ({
  trimVelocity: 150,
  setTrimVelocity: (value) => set((state) => ({ trimVelocity: value })),
}));
