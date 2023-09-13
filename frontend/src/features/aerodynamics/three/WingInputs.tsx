import { SpringValue } from "@react-spring/three";
import WingInputTip from "./WingInputTip";
import WingInputSpan from "./WingInputSpan";
import WingInputChord from "./WingInputChord";
import WingInputAngle from "./WingInputAngle";
import { useWingStore } from "../stores/useWing";

interface Props {
  scale: SpringValue<number>;
  chord: SpringValue<number>;
  chordTip: SpringValue<number>;
  angle: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
}

const WingInputs = ({ chordTip, chord, scale, angle, x, y }: Props) => {
  const shape = useWingStore((state) => state.shape);
  return (
    <>
      {shape === 1 && (
        <>
          <WingInputTip scale={scale} chordTip={chordTip} x={x} y={y} />
          <WingInputAngle scale={scale} y={y} angle={angle} />
        </>
      )}
      <WingInputChord scale={scale} chord={chord} />
      <WingInputSpan scale={scale} x={x} y={y} />
    </>
  );
};

export default WingInputs;
