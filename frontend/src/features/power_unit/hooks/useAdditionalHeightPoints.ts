import { useEffect } from "react";
import { createHeightsArray, useEngineStore } from "./useEngine";
import { useSuperchargerStore } from "./useSupercharger";

export const useAdditionalHeightPoints = () => {
  const heights = useEngineStore((state) => state.heights);
  const setHeights = useEngineStore((state) => state.setHeights);
  const LGendAltitude = useSuperchargerStore(
    (state) => state.lowGear.endAltitude
  );
  const endPower = useSuperchargerStore((state) => state.lowGear.endPower);
  const HGstartAltitude = useSuperchargerStore(
    (state) => state.highGear.startAltitude
  );
  const HGendAltitude = useSuperchargerStore(
    (state) => state.highGear.endAltitude
  );
  const setHGstartPower = useSuperchargerStore(
    (state) => state.setHGstartPower
  );
  const superchargerEnabled = useSuperchargerStore((state) => state.enabled);

  useEffect(() => {
    const newHeights = [
      ...createHeightsArray(10),
      LGendAltitude,
      HGstartAltitude,
      HGendAltitude,
    ].sort((a, b) => a - b);
    setHeights([...new Set(newHeights)]);
    console.log([...new Set(newHeights)]);
  }, [LGendAltitude, HGstartAltitude, HGendAltitude, setHeights]);
};
