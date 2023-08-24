import InputUnits from "../../common/inputs/InputUnits";
import { useWingStore } from "../stores/useWing";
import { Html } from "@react-three/drei";
import { SpringValue, animated, to } from "@react-spring/three";
import WingInputTip from "./WingInputTip";
import WingInputSpan from "./WingInputSpan";
import WingInputChord from "./WingInputChord";

interface Props {
  scale: SpringValue<number>;
  chord: SpringValue<number>;
  chordTip: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
}

const WingInputs = ({ chordTip, chord, scale, x, y }: Props) => {
  const wing = useWingStore();

  return (
    <>
      <WingInputTip scale={scale} chordTip={chordTip} x={x} y={y} />
      <WingInputChord scale={scale} chord={chord} x={x} y={y} />
      <WingInputSpan scale={scale} chordTip={chordTip} x={x} y={y} />
      <animated.mesh
        position={to([chordTip, x, y, scale], (chordTip, x, y, scale) => [
          x + chordTip / 2,
          y + 1.5 / scale,
          0,
        ])}
        scale={scale.to((scale) => [1 / scale, 1 / scale, 1 / scale])}
      >
        {/* <Html className="select-none" color="black" transform>
          <InputUnits
            label="Tip Chord"
            type="length"
            value={wing.chordTip}
            setter={wing.setChordTip}
          />
        </Html> */}
      </animated.mesh>
    </>
  );
};

export default WingInputs;
