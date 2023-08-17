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
  area: {
    m2: 1,
    ft2: 0.09290304,
  },
  power: {
    kW: 1,
    hp: 0.73549875,
  },
};

export const unitDisplay: Record<string, Record<string, string>> = {
  speed: {
    "m/s": "\\frac{m}{s}",
    "km/h": "\\frac{km}{h}",
    mph: "mph",
    kn: "kn",
  },
  altitude: {
    km: "km",
    m: "m",
    ft: "ft",
  },
  length: {
    m: "m",
    ft: "ft",
  },
  area: {
    m2: "m^2",
    ft2: "ft^2",
  },
  power: {
    kW: "kW",
    hp: "hp",
  },
};
