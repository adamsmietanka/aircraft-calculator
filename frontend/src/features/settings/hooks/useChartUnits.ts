import { useGlobalUnitsStore } from "../stores/useGlobalUnits";

const useChartUnits = (type: string | undefined) => {
  interface UnitData {
    displayMultiplier: number;
    valueMultiplier: number;
  }

  const units: Record<string, Record<string, UnitData>> = {
    altitude: {
      km: {
        displayMultiplier: 1,
        valueMultiplier: 1,
      },
      ft: {
        displayMultiplier: 5, // e.x. 2km turns into 10K feet
        valueMultiplier: 1.524, // 2 km * 1.524 = 3.048 km = 10k ft
      },
    },
    length: {
      m: {
        displayMultiplier: 1,
        valueMultiplier: 1,
      },
      ft: {
        displayMultiplier: 5,
        valueMultiplier: 1.524,
      },
    },
    power: {
      kW: {
        displayMultiplier: 1,
        valueMultiplier: 1,
      },
      hp: {
        displayMultiplier: 1,
        valueMultiplier: 0.73549875,
      },
    },
    speed: {
      "m/s": {
        displayMultiplier: 1,
        valueMultiplier: 1,
      },
      mph: {
        displayMultiplier: 2.5,
        valueMultiplier: 1.1176,
      },
      "km/h": {
        displayMultiplier: 2.5,
        valueMultiplier: 0.6944445,
      },
      kn: {
        displayMultiplier: 2.5,
        valueMultiplier: 1.287,
      },

    },
  };

  if (type) {
    const unit = useGlobalUnitsStore((state) => state.types[type]);
    const { displayMultiplier, valueMultiplier } = units[type][unit];

    return { displayMultiplier, valueMultiplier, unit };
  }

  return { displayMultiplier: 1, valueMultiplier: 1, unit: "" };
};

export default useChartUnits;
