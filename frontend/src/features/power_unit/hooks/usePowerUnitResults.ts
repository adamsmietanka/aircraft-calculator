import {
  barycentricAngle,
  barycentricX,
  barycentricZ,
} from "../../../utils/interpolation/binarySearch";
import { cp } from "../../../data/cp";
import { eff } from "../../../data/eff";
import { usePower } from "./usePower";
import { TableRow, useResultsStore } from "../stores/useResults";
import { useEffect, useMemo } from "react";
import { usePropellerStore } from "../stores/usePropeller";
import { useEngineStore } from "../stores/useEngine";

export const usePowerUnitResults = () => {
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);

  const diameter = usePropellerStore((state) => state.diameter);
  const speed = usePropellerStore((state) => state.cruiseSpeed);
  const blades = usePropellerStore((state) => state.blades);
  const variable = usePropellerStore((state) => state.variable);
  const angle = usePropellerStore((state) => state.angle);

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

  const POINTS_BEFORE_MAX_RPM = 50;

  const points_fixed = useMemo(() => {
    let points: number[] = [];
    const j_lim = barycentricX(cpMesh.J, cpMesh.angles, cpMesh.Z, angle, Cp);
    const j_end = barycentricX(cpMesh.J, cpMesh.angles, cpMesh.Z, angle, 0);
    for (let i = 0; i < POINTS_BEFORE_MAX_RPM; i++) {
      points.push((i * j_lim) / POINTS_BEFORE_MAX_RPM);
    }
    for (let i = 0; i < 6; i++) {
      points.push(j_lim + (i * (j_end - j_lim)) / 5);
    }
    return points;
  }, [cpMesh, angle, Cp]);

  useEffect(() => {
    const table: TableRow[] = [];
    const cpMarkers = [];
    const effMarkers = [];
    if (variable) {
      for (let v = 0; v <= 1.2 * speed; v += 1) {
        const j = v / (propellerSpeed * diameter);
        const cp = Cp;
        // const rpm = propellerSpeed * 60 / Ratio
        const angle = barycentricAngle(
          cpMesh.J,
          cpMesh.angles,
          cpMesh.Z,
          j,
          Cp
        );
        const eff = barycentricZ(
          effMesh.J,
          effMesh.angles,
          effMesh.Z,
          j,
          angle
        );
        const prop_power = power * eff;
        table.push({ v, j, cp, angle, eff, prop_power });
        cpMarkers.push(angle, Cp, j);
        effMarkers.push(angle, eff, j);
      }
    } else {
      points_fixed.forEach((j, index) => {
        const Cp_fixed = barycentricZ(
          cpMesh.J,
          cpMesh.angles,
          cpMesh.Z,
          j,
          angle
        );
        const eff = barycentricZ(
          effMesh.J,
          effMesh.angles,
          effMesh.Z,
          j,
          angle
        );
        let n = Math.sqrt((Cp * propellerSpeed * propellerSpeed) / Cp_fixed);
        // engine max speed cannot be surpassed
        if (index >= POINTS_BEFORE_MAX_RPM) {
          n = propellerSpeed;
        }
        const prop_power = (power * eff * n) / propellerSpeed;
        const v = j * n * diameter;
        const rpm = (n * 60) / reductionRatio;
        table.push({ v, j, cp: Cp_fixed, angle, eff, prop_power });
        cpMarkers.push(angle, Cp_fixed, j);
        effMarkers.push(angle, eff, j);
      });
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
    angle,
    points_fixed,
    variable,
    reductionRatio,
    setCpMarkers,
    setEffMarkers,
    setTable,
  ]);
  return [power, Cp];
};
