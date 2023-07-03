import { useGlobalUnitsStore } from "../stores/useGlobalUnits";

const useChartUnits = (type?: string) => {
  const unit = useGlobalUnitsStore((state) => state.types.altitude);

  interface UnitData {
    displayMultiplier: number;
    valueMultiplier: number;
  }

  const units: Record<string, Record<string, UnitData>> = {
    altitude: {
      ft: {
        displayMultiplier: 5, //2km turns into 10K feet
        valueMultiplier: 1.524,
      },
      km: {
        displayMultiplier: 1,
        valueMultiplier: 1,
      },
    },
  };
  const { displayMultiplier, valueMultiplier } = units.altitude[unit];

  return { displayMultiplier, valueMultiplier, unit };
};

export default useChartUnits;