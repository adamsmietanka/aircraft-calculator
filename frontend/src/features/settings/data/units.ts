export const unitMultipliers: Record<string, Record<string, number>> = {
  speed: {
    "m/s": 1,
    "km/h": 0.277778,
    mph: 0.44704,
    kn: 0.514444,
  },
  altitude: {
    km: 1,
    m: 0.001,
    ft: 0.0003048,
  },
  length: {
    m: 1,
    ft: 0.3048,
  },
  power: {
    kW: 1,
    hp: 0.73549875,
  },
};
