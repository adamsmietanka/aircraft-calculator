import { useEffect, useMemo, useState } from "react";
import { cp } from "../../data/cp";
import {
  generate_verts,
  generate_verts_rev,
  rotate_mesh,
} from "../../utils/three/meshGeneration";
import { TableRow, useResultsStore } from "./stores/useResults";
import InputAltitude from "../common/InputAltitude";
import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";
import InputDisabled from "../common/InputDisabled";
import { usePower } from "./hooks/usePower";
import { usePropellerStore } from "./stores/usePropeller";
import { useEngineStore } from "./hooks/useEngine";
import {
  barycentricAngle,
  barycentricZ,
} from "../../utils/interpolation/binarySearch";
import { eff } from "../../data/eff";
import PowerUnitResultsCp from "./PowerUnitResultsCp";
import PowerUnitResultsEff from "./PowerUnitResultsEff";
import PowerUnitResultsPowerChart from "./PowerUnitResultsPowerChart";

interface Point {
  v: number;
  j: number;
  angle: number;
}

const PowerUnitResults = () => {
  const altitude = useResultsStore((state) => state.altitude);
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const diameter = usePropellerStore((state) => state.diameter);
  const speed = usePropellerStore((state) => state.cruiseSpeed);
  const blades = usePropellerStore((state) => state.blades);
  const setAltitude = useResultsStore((state) => state.setAltitude);
  const setCpMarkers = useResultsStore((state) => state.setCpMarkers);
  const setEffMarkers = useResultsStore((state) => state.setEffMarkers);
  const setTable = useResultsStore((state) => state.setTable);

  const [calculatePower] = usePower();
  const power = calculatePower(altitude);
  const density = 1.2255 * (1 - altitude / 44.3) ** 4.256;
  const propellerSpeed = (engineSpeed * reductionRatio) / 60;
  const Cp = (power * 1000) / (density * propellerSpeed ** 3 * diameter ** 5);
  const cpMesh = useMemo(() => cp[blades], [blades]);
  const effMesh = useMemo(() => eff[blades], [blades]);

  useEffect(() => {
    const table: TableRow[] = [];
    const cpMarkers = [];
    const effMarkers = [];
    for (let v = 0; v <= 1.2 * speed; v += 10) {
      const j = v / (propellerSpeed * diameter);
      // const rpm = propellerSpeed * 60 / Ratio
      const angle = barycentricAngle(cpMesh.J, cpMesh.angles, cpMesh.Z, j, Cp);
      const eff = barycentricZ(effMesh.J, effMesh.angles, effMesh.Z, j, angle);
      const prop_power = power * eff;
      table.push({ v, j, angle, eff, prop_power });
      cpMarkers.push(angle, Cp, j);
      effMarkers.push(angle, eff, j);
    }
    console.log(table);
    setTable(table);
    setCpMarkers(new Float32Array(cpMarkers));
    setEffMarkers(new Float32Array(effMarkers));
    // console.log(generate_verts(rotate_mesh(cp[2])));
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

  return (
    <div className="flex w-full p-4">
      <div className="flex flex-col w-80 mr-8 space-y-2">
        <InputAltitude value={altitude} setter={setAltitude} label="Altitude" />
        <InputDisabled
          value={Math.round(power * 100) / 100}
          label="Power"
          unit="kW"
          tooltip="Engine max power read from the Engine tab"
        />
        <InputDisabled
          value={Math.round(Cp * 10000) / 10000}
          label="Cp"
          unit="kW"
          tooltip="Coefficient of Power - this is usually stated as the amount of power the propeller absorbs"
        />
        <PowerUnitPropellerBlades />
        <PowerUnitPropellerPitch />
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex">
          <PowerUnitResultsCp />
          <PowerUnitResultsEff />
        </div>
        <PowerUnitResultsPowerChart />
      </div>
    </div>
  );
};

export default PowerUnitResults;
