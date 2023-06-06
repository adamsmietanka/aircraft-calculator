interface UnitData {
  step: number;
  multiplier: number;
  round?: boolean;
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
      round: true,
    },
    mph: {
      step: 1,
      multiplier: 0.44704,
      round: true,
    },
    kn: {
      step: 1,
      multiplier: 0.514444,
      round: true,
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
      round: true,
    },
    ft: {
      step: 1000,
      multiplier: 0.0003048,
      round: true,
    },
  },
};
