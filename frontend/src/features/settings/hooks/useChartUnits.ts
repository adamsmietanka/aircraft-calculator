import { useGlobalUnitsStore } from "../stores/useGlobalUnits";

const useChartUnits = (type: string) => {
  const unit = useGlobalUnitsStore((state) => state.types[type]);

  interface UnitData {
    displayMultiplier: number;
    valueMultiplier: number;
  }

  const units: Record<string, Record<string, UnitData>> = {
    altitude: {
      ft: {
        displayMultiplier: 5, // e.x. 2km turns into 10K feet
        valueMultiplier: 1.524, // 2 km * 1.524 = 3.048 km = 10k ft
      },
      km: {
        displayMultiplier: 1,
        valueMultiplier: 1,
      },
    },
    power: {
      kW: {
        displayMultiplier: 1,
        valueMultiplier: 1,
      },
      hp: {
        displayMultiplier: 2,
        valueMultiplier: 1.4709975,
      },
    },
  };
  const { displayMultiplier, valueMultiplier } = units[type][unit];

  return { displayMultiplier, valueMultiplier, unit };
};

export default useChartUnits;
