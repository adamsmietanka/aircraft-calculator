import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import { usePlaneStore } from "../stores/usePlane";
import { Props } from "../../common/types/three";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useLocation } from "react-router-dom";

const MeasurementsFuse = ({ opacity }: Props) => {
  const configuration = usePlaneStore((state) => state.configuration);
  const length = usePlaneStore((state) => state.length);
  const wingX = usePlaneStore((state) => state.wingX);
  const fuselageDistance = usePlaneStore((state) => state.fuselageDistance);
  const setFuselageDistance = usePlaneStore(
    (state) => state.setFuselageDistance
  );

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
      <mesh position-x={-wingX} rotation-y={-Math.PI / 2}>
        <AnimatedInputTechnical
          visible={
            pathname === "/aerodynamics/fuselage" &&
            (configuration === 2 || configuration === 3)
          }
          distance={1.25}
          value={fuselageDistance}
          startX={-fuselageDistance}
          opacity={opacity.to((o) => 0.75 * o)}
        >
          <InputDrawing value={fuselageDistance} setter={setFuselageDistance} />
        </AnimatedInputTechnical>
      </mesh>
    </>
  );
};

export default MeasurementsFuse;
