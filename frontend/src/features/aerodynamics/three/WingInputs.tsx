import { SpringValue } from "@react-spring/three";
import WingInputTip from "./WingInputTip";
import WingInputSpan from "./WingInputSpan";
import WingInputAngle from "./WingInputAngle";
import { useWingStore } from "../stores/useWing";
import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import { useHoverWingStore } from "../hooks/useHoverables";
import InputDrawing from "../../common/inputs/InputDrawing";
import Formula from "../../common/Formula";
import useWingScale from "../hooks/useWingScale";

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
  const wing = useWingStore();
  const hoverWing = useHoverWingStore();

  const { scale: wingScale } = useWingScale();
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
          <WingInputAngle opacity={opacity} scale={scale} y={y} angle={angle} />
        </>
      )}
      <AnimatedInputTechnical
        value={wing.chord}
        opacity={opacity.to((o) => 0.75 * o)}
        scale={wingScale}
      >
        <div className={`${hoverWing.chords && "hidden"}`}>
          <InputDrawing value={wing.chord} setter={wing.setChord} />
        </div>
        <Formula
          className={`text-xl ${hoverWing.chords || "hidden"}`}
          tex="\color{green} c"
        />
      </AnimatedInputTechnical>
      <WingInputSpan opacity={opacity} scale={scale} x={x} y={y} />
    </>
  );
};

export default WingInputs;
