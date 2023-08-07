import React from "react";
import InputUnits from "../common/inputs/InputUnits";
import { Canvas } from "@react-three/fiber";
import { useWingStore } from "./stores/useWing";
import InputNumber from "../common/inputs/InputNumber";
import Wing3D from "./three/Wing3D";
import ProfileChoose from "./ProfileChoose";

const Wing = () => {
  const wing = useWingStore();
  return (
    <div className="flex p-6 h-full">
      <div className="flex flex-col w-80 mr-8 space-y-1">
        <InputNumber
          value={wing.chord}
          setter={wing.setChord}
          label="Wing Chord"
          unit="m"
          step={0.1}
        />
        <InputNumber
          value={wing.span}
          setter={wing.setSpan}
          label="Wing Span"
          unit="m"
          step={0.1}
        />
        <ProfileChoose />
      </div>
      <div className="sticky top-1/4 h-3/5 w-3/5">
        <Canvas orthographic camera={{ zoom: 30 }}>
          <Wing3D />
        </Canvas>
      </div>
    </div>
  );
};

export default Wing;
