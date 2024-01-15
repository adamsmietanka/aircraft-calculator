import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import { usePlaneStore } from "../stores/usePlane";
import { Props } from "../../common/types/three";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useLocation } from "react-router-dom";

const MeasurementsFuse = ({ opacity }: Props) => {
  const length = usePlaneStore((state) => state.length);
  const wingX = usePlaneStore((state) => state.wingX);
  const measurements = usePlaneStore((state) => state.measurements);

  const setLength = usePlaneStore((state) => state.setLength);
  const setWingX = usePlaneStore((state) => state.setWingX);

  const { pathname } = useLocation();

  return (
    <>
      <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/fuselage"}
        distance={2}
        value={length}
        startX={-wingX}
        opacity={opacity.to((o) => 0.75 * o)}
      >
        <InputDrawing value={length} setter={setLength} />
      </AnimatedInputTechnical>
      <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/fuselage"}
        distance={1.25}
        value={wingX}
        startX={-wingX}
        opacity={opacity.to((o) => 0.75 * o)}
      >
        <InputDrawing value={wingX} setter={setWingX} />
      </AnimatedInputTechnical>
    </>
  );
};

export default MeasurementsFuse;
