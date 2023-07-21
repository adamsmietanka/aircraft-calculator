import React from "react";
import InputUnits from "../common/inputs/InputUnits";
import { Canvas } from "@react-three/fiber";
import { useWingStore } from "./stores/useWing";

const Fuselage = () => {
  const wing = useWingStore();
  return (
    <div className="flex p-4 h-full">
      <div className="flex flex-col w-80 mr-8 space-y-1">
        <InputUnits
          type="power"
          value={wing.chord}
          setter={wing.setChord}
          label="Wing Chord"
        />
      </div>
      <div className="sticky top-1/4 h-3/5 w-3/5">
        <Canvas orthographic camera={{ zoom: 30 }}>
          {/* <LineChart
            traces={[{ name: "Power", points }]}
            xAxis={{ name: "Altitude", type: "altitude", max: maxAltitude }}
            yAxis={{
              name: "Power",
              type: "power",
              min: 0,
              max: seaLevelPower * 1.4,
            }}
          /> */}
        </Canvas>
      </div>
    </div>
  );
};

export default Fuselage;
