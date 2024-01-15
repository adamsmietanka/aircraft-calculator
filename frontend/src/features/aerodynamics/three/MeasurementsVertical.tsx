import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import { usePlaneStore } from "../stores/usePlane";
import { Props } from "../../common/types/three";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useLocation } from "react-router-dom";
import { useVerticalStore } from "../stores/useVertical";

const MeasurementsVertical = ({ opacity }: Props) => {
  const chordTip = useVerticalStore((state) => state.chordTip);
  const setChordTip = useVerticalStore((state) => state.setChordTip);

  const shape = useVerticalStore((state) => state.shape);

  const length = usePlaneStore((state) => state.length);
  const wingX = usePlaneStore((state) => state.wingX);
  const measurements = usePlaneStore((state) => state.measurements);

  const setLength = usePlaneStore((state) => state.setLength);
  const setWingX = usePlaneStore((state) => state.setWingX);

  const { pathname } = useLocation();

  return (
    <>
      <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/vertical"}
        distance={2}
        value={chordTip}
        startX={-wingX}
        opacity={opacity.to((o) => 0.75 * o)}
      >
        <InputDrawing value={length} setter={setLength} />
      </AnimatedInputTechnical>
      {/* <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/vertical"}
        distance={1.25}
        value={wingX}
        startX={-wingX}
        opacity={opacity.to((o) => 0.75 * o)}
      >
        <InputDrawing value={wingX} setter={setWingX} />
      </AnimatedInputTechnical> */}
    </>
  );
};

export default MeasurementsVertical;
