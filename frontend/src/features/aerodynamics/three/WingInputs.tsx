import { SpringValue } from "@react-spring/three";
import WingInputTip from "./WingInputTip";
import WingInputSpan from "./WingInputSpan";
import WingInputChord from "./WingInputChord";
import WingInputAngle from "./WingInputAngle";

interface Props {
  scale: SpringValue<number>;
  chord: SpringValue<number>;
  chordTip: SpringValue<number>;
  angle: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
}

const WingInputs = ({ chordTip, chord, scale, angle, x, y }: Props) => {
  return (
    <>
      <WingInputTip scale={scale} chordTip={chordTip} x={x} y={y} />
      <WingInputChord scale={scale} chord={chord} />
      <WingInputSpan scale={scale} x={x} y={y} />
      <WingInputAngle scale={scale} y={y} angle={angle} />
    </>
  );
};

export default WingInputs;
