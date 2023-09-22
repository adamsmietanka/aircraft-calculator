import { SpringValue } from "@react-spring/three";
import WingInputTip from "./WingInputTip";
import WingInputSpan from "./WingInputSpan";
import WingInputChord from "./WingInputChord";
import WingInputAngle from "./WingInputAngle";
import { useWingStore } from "../stores/useWing";

interface Props {
  scale: SpringValue<number>;
  opacity: SpringValue<number>;
  chord: SpringValue<number>;
  chordTip: SpringValue<number>;
  angle: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
}

const WingInputs = ({
  chordTip,
  chord,
  scale,
  angle,
  x,
  y,
  opacity,
}: Props) => {
  const shape = useWingStore((state) => state.shape);
  return (
    <>
      {shape === 1 && (
        <>
          <WingInputTip
            opacity={opacity}
            scale={scale}
            chordTip={chordTip}
            x={x}
            y={y}
          />
          <WingInputAngle
            opacity={opacity} scale={scale} y={y} angle={angle} />
        </>
      )}
      <WingInputChord
            opacity={opacity} scale={scale} chord={chord} />
      <WingInputSpan
            opacity={opacity} scale={scale} x={x} y={y} />
    </>
  );
};

export default WingInputs;
