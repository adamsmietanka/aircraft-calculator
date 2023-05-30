import {
  barycentricAngle,
  barycentricZ,
} from "../../../utils/interpolation/binarySearch";
import { cp } from "../../../data/cp";
import { eff } from "../../../data/eff";
import { usePower } from "./usePower";
import { TableRow, useResultsStore } from "../stores/useResults";
import { useEffect, useMemo } from "react";
import { usePropellerStore } from "../stores/usePropeller";
import { useEngineStore } from "./useEngine";

export const usePowerUnitResults = () => {
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);

  const diameter = usePropellerStore((state) => state.diameter);
  const speed = usePropellerStore((state) => state.cruiseSpeed);
  const blades = usePropellerStore((state) => state.blades);

  const altitude = useResultsStore((state) => state.altitude);
  const setCpMarkers = useResultsStore((state) => state.setCpMarkers);
  const setEffMarkers = useResultsStore((state) => state.setEffMarkers);
  const setTable = useResultsStore((state) => state.setTable);

  const cpMesh = useMemo(() => cp[blades], [blades]);
  const effMesh = useMemo(() => eff[blades], [blades]);

  const [calculatePower] = usePower();
  const power = calculatePower(altitude);
  const density = 1.2255 * (1 - altitude / 44.3) ** 4.256;
  const propellerSpeed = (engineSpeed * reductionRatio) / 60;
  const Cp = (power * 1000) / (density * propellerSpeed ** 3 * diameter ** 5);

  useEffect(() => {
    const table: TableRow[] = [];
    const cpMarkers = [];
    const effMarkers = [];
    for (let v = 0; v <= 1.2 * speed; v += 1) {
      const j = v / (propellerSpeed * diameter);
      const cp = Cp;
      // const rpm = propellerSpeed * 60 / Ratio
      const angle = barycentricAngle(cpMesh.J, cpMesh.angles, cpMesh.Z, j, Cp);
      const eff = barycentricZ(effMesh.J, effMesh.angles, effMesh.Z, j, angle);
      const prop_power = power * eff;
      table.push({ v, j, cp, angle, eff, prop_power });
      cpMarkers.push(angle, Cp, j);
      effMarkers.push(angle, eff, j);
    }
    setTable(table);
    setCpMarkers(new Float32Array(cpMarkers));
    setEffMarkers(new Float32Array(effMarkers));
  }, [
    power,
    altitude,
    cpMesh,
    effMesh,
    Cp,
    diameter,
    propellerSpeed,
    speed,
    setCpMarkers,
    setEffMarkers,
    setTable,
  ]);
  return [power, Cp]
};
