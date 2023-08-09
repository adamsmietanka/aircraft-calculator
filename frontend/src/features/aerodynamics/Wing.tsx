import { Canvas } from "@react-three/fiber";
import { useWingStore } from "./stores/useWing";
import InputNumber from "../common/inputs/InputNumber";
import Wing3D from "./three/Wing3D";
import ProfileChoose from "./ProfileChoose";
import useWingAerodynamics from "./hooks/useWingAerodynamics";
import InputUnits from "../common/inputs/InputUnits";

const Wing = () => {
  const wing = useWingStore();
  const { area, aspectRatio, meanAerodynamicChord, stallReynolds } = useWingAerodynamics();

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
          value={wing.chordTip}
          setter={wing.setChordTip}
          label="Tip Chord"
          unit="m"
          step={0.1}
        />
        <InputNumber
          value={wing.angle}
          setter={wing.setAngle}
          label="Sweep Angle"
          unit="°"
          step={1}
        />
        <InputNumber
          value={wing.span}
          setter={wing.setSpan}
          label="Wing Span"
          unit="m"
          step={0.1}
        />
        <ProfileChoose />
        <InputNumber
          disabled
          value={area}
          label="Wing Surface Area"
          roundTo={0.01}
          unit="m²"
        />
        <InputNumber
          disabled
          tooltip="Aspect ratio of a wing is the ratio of its span to its mean chord"
          value={aspectRatio}
          label="Wing Aspect Ratio"
        />
        <InputNumber
          disabled
          tooltip="MAC is the chord of a rectangular wing with the same area and span as those of the given wing"
          value={meanAerodynamicChord}
          label="Mean Aerodynamic Chord"
          unit="m"
        />
        <InputUnits
          type="speed"
          value={wing.stallVelocity}
          setter={wing.setStallVelocity}
          label="Stall Velocity"
        />
        <InputNumber
          disabled
          value={stallReynolds/ 1000000}
          label="Stall Reynolds Number"
          unit="10⁶"
        />
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
