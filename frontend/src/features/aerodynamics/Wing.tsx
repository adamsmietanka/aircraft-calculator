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
        <InputUnits
          label="Wing Chord"
          type="length"
          value={wing.chord}
          setter={wing.setChord}
        />
        <InputNumber
          value={wing.angle}
          setter={wing.setAngle}
          label="Sweep Angle"
          unit="°"
          step={1}
        />
        <InputUnits
          label="Wing Span"
          type="length"
          value={wing.span}
          setter={wing.setSpan}
        />
        <ProfileChoose />
        <WingMaterial />
        <InputUnits
          label="Wing Surface Area"
          type="area"
          disabled
          value={area}
        />
        <InputNumber
          disabled
          tooltip="Aspect ratio of a wing is the ratio of its span to its mean chord"
          value={aspectRatio}
          label="Wing Aspect Ratio"
        />
        <InputUnits
          label="Mean Aerodynamic Chord"
          type="length"
          disabled
          tooltip="MAC is the chord of a rectangular wing with the same area and span as those of the given wing"
          value={meanAerodynamicChord}
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
              x: { name: "Angle of Attack", min: -20, max: 25 },
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
