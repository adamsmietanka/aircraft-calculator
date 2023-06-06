interface UnitData {
  step: number;
  multiplier: number;
}
export const unitData: Record<string, Record<string, UnitData>> = {
  speed: {
    "m/s": {
      step: 1,
      multiplier: 1,
    },
    "km/h": {
      step: 1,
      multiplier: 0.277778,
    },
    mph: {
      step: 1,
      multiplier: 0.44704,
    },
    kn: {
      step: 1,
      multiplier: 0.514444,
    },
  },
  altitude: {
    km: {
      step: 0.1,
      multiplier: 1,
    },
    m: {
      step: 100,
      multiplier: 0.001,
    },
    ft: {
      step: 1000,
      multiplier: 0.0003048,
    },
  },
  power: {
    kW: {
      step: 10,
      multiplier: 1,
    },
    hp: {
      step: 10,
      multiplier: 0.73549875,
    },
  },
};
