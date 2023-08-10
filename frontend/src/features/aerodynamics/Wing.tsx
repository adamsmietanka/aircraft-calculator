import { Canvas } from "@react-three/fiber";
import { useWingStore } from "./stores/useWing";
import InputNumber from "../common/inputs/InputNumber";
import Wing3D from "./three/Wing3D";
import ProfileChoose from "./ProfileChoose";
import useWingAerodynamics from "./hooks/useWingAerodynamics";
import InputUnits from "../common/inputs/InputUnits";
import LineChart from "../common/three/LineChart";
import WingMaterial from "./WingMaterial";

const Wing = () => {
  const wing = useWingStore();
  const {
    area,
    aspectRatio,
    meanAerodynamicChord,
    stallReynolds,
    pointsCl,
    pointsCd,
  } = useWingAerodynamics();

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
        <WingMaterial />
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
          min={30}
          label="Stall Velocity"
        />
        <InputNumber
          disabled
          value={stallReynolds / 1000000}
          label="Stall Reynolds Number"
          unit="10⁶"
        />
      </div>
      <div
        className="sticky flex top-1/4 h-3/5 w-3/4"
        style={{ height: "65vh" }}
      >
        <Canvas orthographic camera={{ zoom: 30 }}>
          <Wing3D />
        </Canvas>
        <Canvas orthographic camera={{ zoom: 30 }}>
          <LineChart
            name="Coefficient of Lift"
            traces={[{ name: "Power", points: pointsCl }]}
            axes={{
              x: { name: "Angle of Attack", min: -20, max: 20 },
              y: {
                name: "Coefficient of Lift (Cl)",
                min: -1.5,
                max: 1.5,
              },
            }}
            // store={useProfileChartsStore}
          />
        </Canvas>
        <Canvas orthographic camera={{ zoom: 30 }}>
          <LineChart
            name="Coefficient of Drag"
            traces={[{ name: "Power", points: pointsCd }]}
            axes={{
              x: {
                name: "Coefficient of Drag (Cd)",
                min: 0,
                max: 0.041,
              },
              y: {
                name: "Cl",
                min: -1.5,
                max: 1.5,
              },
            }}
            // store={useProfileChartsStore}
            // yHover
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Wing;
